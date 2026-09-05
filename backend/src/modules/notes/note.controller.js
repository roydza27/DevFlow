import * as noteService from './note.service.js';

export function addNote(req, res, next) {
  try {
    noteService.addNote(req.params.id, req.body);
    res.status(201).json({ message: 'Note added' });
  } catch (err) {
    next(err);
  }
}

export function updateNote(req, res, next) {
  try {
    noteService.updateNote(req.params.noteId, req.body);
    res.json({ message: 'Note updated' });
  } catch (err) {
    next(err);
  }
}

export function deleteNote(req, res, next) {
  try {
    noteService.deleteNote(req.params.noteId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
