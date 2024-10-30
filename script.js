const notesContainer = document.getElementById("notesContainer");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteForm = document.getElementById("noteForm");

noteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addOrUpdateNote();
});

async function loadNotes() {
    const response = await fetch("http://localhost:8080/api/notes");
    const data = await response.json();
    notesContainer.innerHTML = "";

    data.forEach(note => {
        const noteElement = document.createElement("li");
        noteElement.classList.add("note");
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button onclick="editNote(${note.id})" class="btn edit">Edit</button>
                <button onclick="deleteNote(${note.id})" class="btn delete">Delete</button>
            </div>
        `;
        notesContainer.appendChild(noteElement);
    });
}

async function addOrUpdateNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title && content) {
        let method = "POST";
        let url = "http://localhost:8080/api/notes";

        if (noteTitle.dataset.id) { 
            method = "PUT";
            url = `http://localhost:8080/api/notes/${noteTitle.dataset.id}`;
        }

        await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
        });

        noteTitle.value = "";
        noteContent.value = "";
        delete noteTitle.dataset.id;
        loadNotes();
    }
}

async function editNote(id) {
    const response = await fetch(`http://localhost:8080/api/notes/${id}`);
    const note = await response.json();

    noteTitle.value = note.title;
    noteContent.value = note.content;
    noteTitle.dataset.id = note.id;
}

async function deleteNote(id) {
    await fetch(`http://localhost:8080/api/notes/${id}`, {
        method: "DELETE"
    });
    loadNotes();
}

loadNotes();
