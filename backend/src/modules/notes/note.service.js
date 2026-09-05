import * as noteRepo from './note.repository.js';

export function getNotesByProjectId(projectId) {
  return noteRepo.getNotesByProjectId(projectId);
}

export function addNote(projectId, note) {
  noteRepo.addNote(projectId, note);
}

export function updateNote(noteId, data) {
  noteRepo.updateNote(noteId, data);
}

export function deleteNote(noteId) {
  noteRepo.deleteNote(noteId);
}
