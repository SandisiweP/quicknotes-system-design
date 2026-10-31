# QuickNotes Data Model

## Entities & Schema Columns

1. **`users`**
   - `id` (INTEGER, PK, Auto-increment)
   - `username` (VARCHAR(50), NOT NULL, UNIQUE)
   - `email` (VARCHAR(100), NOT NULL, UNIQUE)
   - `created_at` (TIMESTAMP)

2. **`notes`**
   - `id` (INTEGER, PK, Auto-increment)
   - `user_id` (INTEGER, FK referencing `users(id)`, NOT NULL)
   - `title` (VARCHAR(100), NOT NULL)
   - `body` (TEXT)
   - `created_at` (TIMESTAMP)

3. **`tags`**
   - `id` (INTEGER, PK, Auto-increment)
   - `name` (VARCHAR(30), NOT NULL, UNIQUE)

4. **`note_tags` (Join Table)**
   - `note_id` (INTEGER, FK referencing `notes(id)`, NOT NULL)
   - `tag_id` (INTEGER, FK referencing `tags(id)`, NOT NULL)
   - *Primary Key:* Composite `(note_id, tag_id)`

---

## Relationships
* **`users` to `notes` (One-to-Many):** One user can create many notes, but each note belongs to exactly one user.
* **`notes` to `tags` (Many-to-Many):** A single note can have multiple tags (e.g., #work, #urgent), and a single tag can be applied to many different notes. This relationship is resolved using the **`note_tags` join table**.

---

## SQL CREATE TABLE Statements

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);