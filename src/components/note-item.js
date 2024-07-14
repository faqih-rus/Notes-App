import anime from 'animejs';
import { deleteNote as apiDeleteNote, archiveNote as apiArchiveNote, unarchiveNote as apiUnarchiveNote } from '../data/api.js';

class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'body', 'created-at', 'archived'];
  }

  set noteData(note) {
    this._note = note;
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.animateEntry();
  }

  render() {
    this.innerHTML = `
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
      </style>
      <div class="note-item">
        <div class="details">
          <p>${this.getAttribute('title')}</p>
          <div class="body">${this.getAttribute('body')}</div>
        </div>
        <div class="bottom-content">
          <div class="date">${new Date(this.getAttribute('created-at')).toLocaleDateString()}</div>
          <div class="actions">
            <button class="action-button archive">${this.getAttribute('archived') === 'true' ? 'Unarchive' : 'Archive'}</button>
            <button class="action-button delete">Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const archiveButton = this.querySelector('.archive');
    const deleteButton = this.querySelector('.delete');

    archiveButton.addEventListener('click', () => {
      if (this.getAttribute('archived') === 'true') {
        this.unarchiveNote();
      } else {
        this.archiveNote();
      }
    });

    deleteButton.addEventListener('click', () => {
      this.animateDelete();
    });
  }

  async archiveNote() {
    const noteId = this.getAttribute('id');

    try {
      await apiArchiveNote(noteId);
      this.setAttribute('archived', 'true');
      const event = new CustomEvent('note-archived', { detail: { id: noteId } });
      this.dispatchEvent(event);
    } catch (error) {
      alert(`Failed to archive the note: ${error.message}`);
    }
  }

  async unarchiveNote() {
    const noteId = this.getAttribute('id');

    try {
      await apiUnarchiveNote(noteId);
      this.setAttribute('archived', 'false');
      const event = new CustomEvent('note-unarchived', { detail: { id: noteId } });
      this.dispatchEvent(event);
    } catch (error) {
      alert(`Failed to unarchive the note: ${error.message}`);
    }
  }

  async deleteNote() {
    const noteId = this.getAttribute('id');
  
    try {
      const deleted = await apiDeleteNote(noteId);
      if (deleted) {
        const event = new CustomEvent('note-deleted', { detail: { id: noteId }, bubbles: true });
        this.dispatchEvent(event);
        this.remove();
      }
    } catch (error) {
      alert(`Failed to delete the note: ${error.message}`);
    }
  }

  animateEntry() {
    anime({
      targets: this.querySelector('.note-item'),
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutQuad',
    });
  }

  animateDelete() {
    anime({
      targets: this.querySelector('.note-item'),
      translateY: [0, -20],
      opacity: [1, 0],
      duration: 500,
      easing: 'easeInQuad',
      complete: () => this.deleteNote(),
    });
  }
}

if (!customElements.get('note-item')) {
  customElements.define('note-item', NoteItem);
}
export default NoteItem;
