import './note-item.js';

class NoteList extends HTMLElement {
  connectedCallback() {
    this.notes = [];
    this.fetchNotes();
  }

  set notes(noteArray) {
    this._notes = noteArray;
    this.render();
  }

  async fetchNotes() {
    try {
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const result = await response.json();
      this.notes = result.data;
      this.render();
    } catch (error) {
      alert(`Failed to fetch notes: ${error.message}`);
    }
  }

  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  get notes() {
    return this._notes;
  }

  render() {
    this.innerHTML = `
      <style>
      :host {
        display: grid;
        gap: 2rem;
        padding: 2rem;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        max-width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
      }

      @media (max-width: 768px) {
        :host {
          padding: 1rem;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
      }
      </style>
      ${this.notes
        .map(
          (note) => `
        <note-item 
          title="${note.title}"
          body="${note.body}"
          created-at="${note.createdAt}"
          id="${note.id}"
          archived="${note.archived}">
        </note-item>
      `,
        )
        .join('')}
    `;
  }
}

if (!customElements.get('note-list')) {
  customElements.define('note-list', NoteList);
}
export default NoteList;
