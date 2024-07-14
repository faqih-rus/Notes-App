import anime from 'animejs';
import { showLoading, hideLoading } from '../utils/loading.js';
import '../components/loading-indicator.js';

export class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupFormEventListeners();
    this.setupViewArchiveEventListener();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 600px;
          margin: 0 auto 2rem;
        }
        .note-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(53, 114, 239, 0.1), 0 1px 3px rgba(53, 114, 239, 0.08);
        }
        .form-group {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
        .note-form input,
        .note-form textarea {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #3572EF;
          border-radius: 8px;
          box-sizing: border-box;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .note-form input:focus,
        .note-form textarea:focus {
          outline: none;
          border-color: #1E40AF;
          box-shadow: 0 0 0 3px rgba(53, 114, 239, 0.2);
        }
        .note-form input:invalid,
        .note-form textarea:invalid {
          border-color: #EF4444;
        }
        .note-form button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          background-color: #3572EF;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          justify-self: start;
          transition: background-color 0.3s ease;
        }
        .note-form button:hover {
          background-color: #1E40AF;
        }
        .error-message {
          color: #EF4444;
          font-size: 0.875rem;
        }
        @media (max-width: 600px) {
          :host {
            padding: 0 1rem;
          }
        }
        #loading-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          visibility: hidden;
          opacity: 0;
          transition: visibility 0s, opacity 0.3s linear;
        }
        #loading-indicator.visible {
          visibility: visible;
          opacity: 1;
        }
      </style>
      <form class="note-form">
        <div class="form-group">
          <input type="text" placeholder="Title" id="title" name="title" required minlength="3" maxlength="50">
          <span id="title-error" class="error-message"></span>
        </div>
        <div class="form-group">
          <textarea name="body" placeholder="Body" id="body" required minlength="10" rows="4"></textarea>
          <span id="body-error" class="error-message"></span>
        </div>
        <button type="submit">Add Note</button>
        <button type="button" id="view-archive">View Archived Notes</button>
      </form>
      <loading-indicator id="loading-indicator"></loading-indicator>
    `;
  }

  setupFormEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const titleInput = this.shadowRoot.querySelector('#title');
    const bodyInput = this.shadowRoot.querySelector('#body');
    const titleError = this.shadowRoot.querySelector('#title-error');
    const bodyError = this.shadowRoot.querySelector('#body-error');

    const validateInput = (input, errorElement) => {
      if (!input.validity.valid) {
        errorElement.textContent = input.validationMessage;
      } else {
        errorElement.textContent = '';
      }
    };

    titleInput.addEventListener('input', () => validateInput(titleInput, titleError));
    bodyInput.addEventListener('input', () => validateInput(bodyInput, bodyError));

    titleInput.addEventListener('blur', () => validateInput(titleInput, titleError));
    bodyInput.addEventListener('blur', () => validateInput(bodyInput, bodyError));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      validateInput(titleInput, titleError);
      validateInput(bodyInput, bodyError);

      if (form.checkValidity()) {
        const newNote = {
          title: titleInput.value,
          body: bodyInput.value,
        };

        showLoading(); 

        try {
          const addedNote = await this.addNoteToAPI(newNote);
          
          setTimeout(() => {
            const event = new CustomEvent('note-added', {
              detail: addedNote,
            });
            this.dispatchEvent(event);
            form.reset();
            titleError.textContent = '';
            bodyError.textContent = '';
          }, 300);

        } catch (error) {
          alert(error.message);
        } finally {
          hideLoading(); 
        }
      }
    });
  }

  setupViewArchiveEventListener() {
    const viewArchiveButton = this.shadowRoot.querySelector('#view-archive');
    viewArchiveButton.addEventListener('click', () => {
      window.location.href = './note-archive.html';
    });
  }

  async addNoteToAPI(newNote) {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const addedNote = await response.json();
    return addedNote.data;
  }
}

if (!customElements.get('note-form')) {
  customElements.define('note-form', NoteForm);
}
export default NoteForm;