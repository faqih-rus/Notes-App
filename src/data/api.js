const BASE_URL = 'https://notes-api.dicoding.dev/v2';

export async function fetchNotes() {
  const response = await fetch(`${BASE_URL}/notes`);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  const data = await response.json();
  return data.data;
}

export async function addNote(note) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    throw new Error('Failed to add note');
  }
  const data = await response.json();
  return data.data;
}

export async function deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
    return true; 
  }

export async function archiveNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to archive note');
  }
}

export async function unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to unarchive note');
    }
    return true; // Indicate successful unarchive
  }

export async function fetchArchivedNotes() {
  const response = await fetch(`${BASE_URL}/notes/archived`);
  if (!response.ok) {
    throw new Error('Failed to fetch archived notes');
  }
  const data = await response.json();
  return data.data;
}
