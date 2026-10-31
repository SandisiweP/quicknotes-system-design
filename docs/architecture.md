# QuickNotes Architecture & Scaling Plan

## Requirements & Load Estimates (1 Million Users)
* **Assumptions:** 1 million registered users, 100,000 Daily Active Users (DAU). Each user reads 20 notes and creates/edits 3 notes per day.
* **Reads per Second (Average):** (100,000 × 20) / 86,400 = **~23.15 reads/sec**
* **Writes per Second (Average):** (100,000 × 3) / 86,400 = **~3.47 writes/sec**
* **Storage per Year:** Assuming average note size is 2 KB: 100,000 users × 3 notes/day × 365 days × 2 KB = **~219 GB/year**.

---

## Architecture Diagram

    [Client / Browser App]
             │
             ▼
          [ DNS ]
             │
             ▼
          [ CDN ] (Static Assets)
             │
             ▼
      [ Load Balancer ]
             │
             ├──► [ App Server 1 ] ◄──► [ In-Memory Cache (Redis) ]
             │         │
             │         ├──► [ Primary Database (Writes) ]
             │         └──► [ Database Read Replica (Reads) ]
             │
             └──► [ Message Queue (RabbitMQ) ]
                           │
                           ▼
                    [ Worker Service ] (Async Tasks / Notifications)

---

## Component Explanations
* **DNS:** Translates human-readable domain names into IP addresses to route user requests.
* **CDN:** Caches static frontend assets (HTML, CSS, JS) globally at edge locations to minimize latency.
* **Load Balancer:** Distributes incoming HTTP traffic evenly across multiple application servers to prevent overloading.
* **App Servers:** Stateless servers that execute backend business logic, authentication, and API processing.
* **Cache (Redis):** Stores frequently accessed data in-memory to reduce database query pressure.
* **Primary Database & Read Replica:** Manages persistent structured relational data, routing write operations to the primary node and read operations to replicas.
* **Message Queue & Worker:** Handles heavy background tasks asynchronously outside the main request-response cycle.

---

## Request Flows

### 1. GET `/api/v1/notes` Flow
1. Client sends a GET request through the Load Balancer.
2. App server checks the **Redis Cache** for cached user notes. If found, returns immediately.
3. If cache misses, the app server queries the **Database Read Replica**.
4. Results are returned to the client and cached in Redis.

### 2. POST `/api/v1/notes` Flow
1. Client sends a POST request with note payload.
2. App server validates the input data.
3. App server writes the new note into the **Primary Database**.
4. (Optional) An asynchronous job is pushed to the **Message Queue** (e.g., search indexing).
5. Success status (`201 Created`) is returned to the client.

---

## Trade-offs & Single Points of Failure (SPoF) Avoidance
* **Trade-off (Read Replicas & Replication Lag):** Using read replicas speeds up read operations, but introduces slight replication lag where a newly created note might take milliseconds to appear in subsequent read queries.
* **Avoiding SPoF:** Single points of failure are avoided by deploying redundant load balancers, running multiple active app servers behind the load balancer, and setting up database failover replicas so the system remains available even if a node crashes.