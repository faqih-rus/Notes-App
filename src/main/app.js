import NoteArchive from '../components/note-archive.js';
import NoteForm from '../components/note-form.js';
import NoteList from '../components/note-list.js';
import NoteItem from '../components/note-item.js';
import AppBar from '../components/app-bar.js';
import LoadingIndicator from '../components/loading-indicator.js';

import { showLoading, hideLoading } from '../utils/loading.js';
import {
  fetchNotes,
  fetchArchivedNotes,
  addNote as apiAddNote,
  deleteNote as apiDeleteNote,
  archiveNote as apiArchiveNote,
  unarchiveNote as apiUnarchiveNote,
} from '../data/api.js';
import '../style/styles.css';

document.addEventListener('DOMContentLoaded', async () => {
  const noteForm = document.querySelector('note-form');
  const noteList = document.querySelector('note-list');
  const noteArchive = document.querySelector('note-archive');

  try {
    showLoading(document.body);
    const notes = await fetchNotes();
    if (noteList) {
      noteList.notes = notes;
    } else {
      console.error('noteList element not found');
    }
  } catch (error) {
    console.error('Failed to fetch notes:', error);
  } finally {
    hideLoading(document.body);
  }

  if (noteArchive) {
    try {
      showLoading(noteArchive);
      const archivedNotes = await fetchArchivedNotes();
      noteArchive.notes = archivedNotes;
    } catch (error) {
      console.error('Failed to fetch archived notes:', error);
    } finally {
      hideLoading(noteArchive);
    }
  } else {
    console.error('noteArchive element not found');
  }

  if (noteForm && !noteForm.hasAddedListener) {
    noteForm.addEventListener('note-added', (event) => {
      if (noteList) {
        noteList.notes = [event.detail, ...noteList.notes];
      }
    });
    noteForm.hasAddedListener = true;
  }

  if (noteList) {
    noteList.addEventListener('note-archived', (event) => {
      noteList.notes = noteList.notes.filter(
        (note) => note.id !== event.detail.id,
      );
    });

    noteList.addEventListener('note-deleted', (event) => {
      noteList.notes = noteList.notes.filter(
        (note) => note.id !== event.detail.id,
      );
    });
  }

  if (noteForm) {
    noteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = event.target.querySelector('button[type="submit"]');

      const titleInput = event.target.querySelector('input[name="title"]');
      const bodyTextarea = event.target.querySelector('textarea[name="body"]');

      if (!titleInput || !bodyTextarea) {
        console.error('Title input or body textarea not found');
        return;
      }

      const noteData = {
        title: titleInput.value,
        body: bodyTextarea.value,
      };

      showLoading(submitButton);

      try {
        const newNote = await apiAddNote(noteData);

        const noteAddedEvent = new CustomEvent('note-added', {
          detail: newNote,
        });
        noteForm.dispatchEvent(noteAddedEvent);
      } catch (error) {
        console.error('Failed to add note:', error);
      } finally {
        hideLoading(submitButton);
      }
    });
  }
});
