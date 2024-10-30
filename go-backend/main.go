package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
)

type Note struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

var (
	notes     []Note
	notesFile = "notes.json"
	mutex     sync.Mutex
)

func main() {
	loadNotes()

	http.HandleFunc("/api/notes", handleNotes)
	http.HandleFunc("/api/notes/", handleNoteByID)

	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func loadNotes() {
	file, err := os.ReadFile(notesFile)
	if err != nil {
		if os.IsNotExist(err) {
			notes = []Note{}
			saveNotes()
			return
		}
		log.Fatalf("Error reading notes file: %v", err)
	}
	json.Unmarshal(file, &notes)
}

func saveNotes() {
	data, err := json.MarshalIndent(notes, "", "  ")
	if err != nil {
		log.Fatalf("Error saving notes: %v", err)
	}
	os.WriteFile(notesFile, data, 0644)
}

func handleNotes(w http.ResponseWriter, r *http.Request) {
	mutex.Lock()
	defer mutex.Unlock()

	switch r.Method {
	case "GET":
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(notes)
	case "POST":
		var newNote Note
		json.NewDecoder(r.Body).Decode(&newNote)

		newNote.ID = generateID()
		notes = append(notes, newNote)
		saveNotes()

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newNote)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleNoteByID(w http.ResponseWriter, r *http.Request) {
	mutex.Lock()
	defer mutex.Unlock()

	id, err := strconv.Atoi(r.URL.Path[len("/api/notes/"):])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	index := findNoteIndexByID(id)
	if index == -1 {
		http.Error(w, "Note not found", http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		json.NewEncoder(w).Encode(notes[index])
	case "PUT":
		var updatedNote Note
		json.NewDecoder(r.Body).Decode(&updatedNote)

		notes[index].Title = updatedNote.Title
		notes[index].Content = updatedNote.Content
		saveNotes()

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(notes[index])
	case "DELETE":
		notes = append(notes[:index], notes[index+1:]...)
		saveNotes()

		w.WriteHeader(http.StatusNoContent)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func generateID() int {
	maxID := 0
	for _, note := range notes {
		if note.ID > maxID {
			maxID = note.ID
		}
	}
	return maxID + 1
}

func findNoteIndexByID(id int) int {
	for i, note := range notes {
		if note.ID == id {
			return i
		}
	}
	return -1
}
