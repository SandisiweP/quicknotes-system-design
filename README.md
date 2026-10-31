# QuickNotes System Design

## Description
QuickNotes is a full-stack note-taking application client paired with a comprehensive enterprise system design, REST API specifications, relational data model, and cloud scaling architecture for 1 million users.

---

## How to Run the API Client
1. Clone this repository locally.
2. Open `index.html` directly in your web browser or use a live server extension (like VS Code Live Server).
3. Click **"Load notes"** to fetch initial posts via GET, use the form to create new notes via POST, and click **Delete** on any note to test removal.

---

## Documentation Links
* [API Design Document](docs/api-design.md)
* [Data Model Document](docs/data-model.md)
* [Architecture Document](docs/architecture.md)

---

## What I Learned
1. **Asynchronous JavaScript & Fetch API:** Gained deep experience handling asynchronous requests, `async/await`, `try/catch` error management, and HTTP response validation.
2. **RESTful Architecture Principles:** Learned how to design clean resource endpoints with proper HTTP methods (`GET`, `POST`, `DELETE`) and standard status codes.
3. **System Scaling & Capacity Planning:** Understood how to calculate traffic throughput (reads/writes per second) and design reliable cloud architectures utilizing load balancers, caching layers, and database read replicas.