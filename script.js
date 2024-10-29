const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesContainer = document.getElementById("notesContainer");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = null;

function renderNotes() {
    notesContainer.innerHTML = "";
    notes.forEach((note, index) => {
        const noteElement = document.createElement("li");
        noteElement.classList.add("note");
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button class="btn edit" onclick="editNote(${index})">Edit</button>
                <button class="btn delete" onclick="deleteNote(${index})">Delete</button>
            </div>
        `;
        notesContainer.appendChild(noteElement);
    });
}

function addOrUpdateNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title && content) {
        if (editIndex !== null) {
            // Update note
            notes[editIndex] = { title, content };
            editIndex = null;
        } else {
            // Add new note
            notes.push({ title, content });
        }
        
        noteTitle.value = "";
        noteContent.value = "";
        saveNotes();
        renderNotes();
    }
}