const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// DOM elements
const loadBtn = document.getElementById('load-btn');
const statusText = document.getElementById('status');
const notesList = document.getElementById('notes-list');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const submitBtn = document.getElementById('submit-btn');

let notesArray = [];

// Reusable async request function with error checking
async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return {};
}

// Render notes using textContent only for safety
function renderNotes() {
  notesList.innerHTML = '';

  if (notesArray.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No notes found.';
    li.className = 'empty-state';
    notesList.appendChild(li);
    return;
  }

  notesArray.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item';

    const titleH3 = document.createElement('h3');
    titleH3.textContent = note.title;

    const bodyP = document.createElement('p');
    bodyP.textContent = note.body;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteNote(note.id, li));

    li.appendChild(titleH3);
    li.appendChild(bodyP);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });
}

// Task 1: Load Notes (GET)
async function loadNotes() {
  statusText.textContent = 'Loading notes...';
  statusText.className = 'status-message loading';
  loadBtn.disabled = true;

  try {
    const data = await request(`${API_URL}?_limit=10`);
    notesArray = data;
    statusText.textContent = 'Loaded 10 notes from the server.';
    statusText.className = 'status-message success';
    renderNotes();
  } catch (error) {
    statusText.textContent = `Error loading notes: ${error.message}`;
    statusText.className = 'status-message error';
  } finally {
    loadBtn.disabled = false;
  }
}

// Task 2: Create Note (POST)
async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  // Validation: title required, max 100 characters
  if (!title || title.length > 100) {
    alert('Title is required and must be maximum 100 characters.');
    return;
  }

  statusText.textContent = 'Creating note...';
  statusText.className = 'status-message loading';
  submitBtn.disabled = true;

  try {
    const newNotePayload = { title, body, userId: 1 };
    const result = await request(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotePayload)
    });

    // Add returned note to the top of the list
    notesArray.unshift(result);
    renderNotes();

    statusText.textContent = `Note created (status 201, id ${result.id}).`;
    statusText.className = 'status-message success';

    // Clear form
    titleInput.value = '';
    bodyInput.value = '';
  } catch (error) {
    statusText.textContent = `Error creating note: ${error.message}`;
    statusText.className = 'status-message error';
  } finally {
    submitBtn.disabled = false;
  }
}

// Task 3: Delete Note (DELETE)
async function deleteNote(id, listItemElement) {
  /* Note: JSONPlaceholder simulates DELETE and returns success, 
     but does not permanently delete items on their server backend. 
     We handle this sensibly by removing it from our local state array immediately. */
  const deleteButton = listItemElement.querySelector('.delete-btn');
  deleteButton.disabled = true;

  try {
    await request(`${API_URL}/${id}`, { method: 'DELETE' });

    notesArray = notesArray.filter(note => note.id !== id);
    renderNotes();

    statusText.textContent = `Note ${id} deleted successfully.`;
    statusText.className = 'status-message success';
  } catch (error) {
    statusText.textContent = `Error deleting note: ${error.message}`;
    statusText.className = 'status-message error';
    deleteButton.disabled = false;
  }
}

// Event Listeners
loadBtn.addEventListener('click', loadNotes);
noteForm.addEventListener('submit', createNote);