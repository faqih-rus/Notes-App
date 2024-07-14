import { fetchArchivedNotes, unarchiveNote as apiUnarchiveNote } from '../data/api.js';
import './app-bar.js';

class NoteArchive extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.notes = [];
    }
  
    async connectedCallback() {
      try {
        await this.fetchArchivedNotes();
        this.render();
        this.setupEventListeners();
      } catch (error) {
        this.renderError(error);
      }
    }
  
    async fetchArchivedNotes() {
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes/archived');
      if (!response.ok) {
        throw new Error('Failed to fetch archived notes');
      }
      const data = await response.json();
      this.notes = data.data;
    }
  

  render(notes) {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .note-item {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(53, 114, 239, 0.1), 0 1px 3px rgba(53, 114, 239, 0.08);
          display: grid;
          grid-template-rows: auto 1fr auto;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          gap: 1rem;
          margin: 1rem;
        }

        .note-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(53, 114, 239, 0.1), 0 4px 6px rgba(53, 114, 239, 0.05);
        }

        .note-item .details {
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 0.75rem;
          overflow: hidden;
        }

        .note-item p {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1E40AF;
        }

        .note-item .body {
          font-size: 1rem;
          color: #4B5563;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .note-item .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #E5E7EB;
        }

        .bottom-content .date {
          font-size: 0.875rem;
          color: #6B7280;
        }

        .bottom-content .actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          background-color: #3572EF;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.3s ease;
        }

        .action-button:hover {
          background-color: #1E40AF;
        }

        .action-button.delete {
          background-color: #EF4444;
        }

        .action-button.delete:hover {
          background-color: #B91C1C;
        }

        .back-button {
          display: inline-block;
          margin-bottom: 1rem;
          padding: 0.5rem 1rem;
          background-color: #3572EF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.3s ease;
          text-decoration: none;
          text-align: center;
        }

        .back-button:hover {
          background-color: #1E40AF;
        }
      </style>
      <app-bar></app-bar>
      <a href="index.html" class="back-button">Back</a>
      <div id="notes-container">
        ${this.notes.map(note => this.renderNoteItem(note)).join('')}
      </div>
    `;

    this.setupEventListeners();
  }
  renderNoteItem(note) {
    return `
      <div class="note-item" data-id="${note.id}">
        <div class="details">
          <p>${note.title}</p>
          <div class="body">${note.body}</div>
        </div>
        <div class="bottom-content">
          <div class="date">${new Date(note.createdAt).toLocaleDateString()}</div>
          <div class="actions">
            <button class="action-button unarchive" data-id="${note.id}">Unarchive</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('click', async (event) => {
      if (event.target.classList.contains('unarchive')) {
        const noteId = event.target.dataset.id;
        try {
          await this.unarchiveNote(noteId);
        } catch (error) {
          alert(`Failed to unarchive note: ${error.message}`);
        }
      }
    });
  }

  async unarchiveNote(noteId) {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/unarchive`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to unarchive note');
    }

    this.notes = this.notes.filter(note => note.id !== noteId);
    this.render();
  }

  renderError(error) {
    this.shadowRoot.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

if (!customElements.get('note-archive')) {
  customElements.define('note-archive', NoteArchive);
}