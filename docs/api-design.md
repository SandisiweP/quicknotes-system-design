# QuickNotes REST API Design

## Endpoints Table

| Method | Path | Description | Success Status |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/notes` | List all notes for the authenticated user | `200 OK` |
| GET | `/api/v1/notes/:id` | Retrieve a single note by ID | `200 OK` |
| POST | `/api/v1/notes` | Create a new note | `201 Created` |
| PUT | `/api/v1/notes/:id` | Update an existing note completely | `200 OK` |
| DELETE | `/api/v1/notes/:id` | Delete a note by ID | `204 No Content` |
| GET | `/api/v1/tags` | List all tags created by the user | `200 OK` |

---

## Examples

### 1. List Notes (`GET /api/v1/notes`)
* **Success Response (`200 OK`):**
```json
[
  {
    "id": 1,
    "title": "Grocery Shopping",
    "body": "Milk, eggs, bread, and coffee.",
    "created_at": "2026-10-31T08:00:00Z"
  }
]