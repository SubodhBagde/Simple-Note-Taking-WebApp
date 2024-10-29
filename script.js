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