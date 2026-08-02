import { Router } from 'express';
import * as sqlite from '../controllers/sqliteController.js';
import { initWorkspaceFolder, watchWorkspaceFolder, validateFolderPath } from '../services/watcherService.js';

const router = Router();

// GET database storage stats
router.get('/stats', (req, res, next) => {
  try {
    const stats = sqlite.getStorageStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// GET all projects/workspaces
router.get('/projects', (req, res, next) => {
  try {
    const projects = sqlite.getAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// CREATE project
router.post('/projects', (req, res, next) => {
  try {
    const id = sqlite.createProjectData(req.body);
    const validPath = validateFolderPath(req.body.folderPath);
    if (validPath) {
      initWorkspaceFolder(validPath, { id, name: req.body.name });
      watchWorkspaceFolder(id, validPath);
    }
    res.status(201).json({ id, message: 'Project created' });
  } catch (err) {
    next(err);
  }
});

// UPDATE project
router.patch('/projects/:id', (req, res, next) => {
  try {
    sqlite.updateProjectData(req.params.id, req.body);
    res.json({ message: 'Project updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE project
router.delete('/projects/:id', (req, res, next) => {
  try {
    sqlite.deleteProjectData(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// LINK folder
router.post('/projects/:id/link-folder', (req, res, next) => {
  try {
    const validPath = validateFolderPath(req.body.folderPath);
    if (!validPath) {
      res.status(400).json({ error: 'Invalid or inaccessible directory path' });
      return;
    }
    sqlite.updateProjectData(req.params.id, { linkedFolderName: validPath });
    initWorkspaceFolder(validPath, { id: req.params.id, name: req.body.name || 'Workspace' });
    watchWorkspaceFolder(req.params.id, validPath);
    res.json({ message: 'Folder linked' });
  } catch (err) {
    next(err);
  }
});

// TASKS
router.post('/projects/:id/tasks', (req, res, next) => {
  try {
    sqlite.addTaskData(req.params.id, req.body);
    res.status(201).json({ message: 'Task added' });
  } catch (err) {
    next(err);
  }
});

router.patch('/tasks/:taskId', (req, res, next) => {
  try {
    sqlite.updateTaskData(req.params.taskId, req.body);
    res.json({ message: 'Task updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/tasks/:taskId', (req, res, next) => {
  try {
    sqlite.deleteTaskData(req.params.taskId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.delete('/projects/:id/tasks/completed', (req, res, next) => {
  try {
    sqlite.clearDoneTasksData(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// NOTES
router.post('/projects/:id/notes', (req, res, next) => {
  try {
    sqlite.addNoteData(req.params.id, req.body);
    res.status(201).json({ message: 'Note added' });
  } catch (err) {
    next(err);
  }
});

router.patch('/notes/:noteId', (req, res, next) => {
  try {
    sqlite.updateNoteData(req.params.noteId, req.body);
    res.json({ message: 'Note updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/notes/:noteId', (req, res, next) => {
  try {
    sqlite.deleteNoteData(req.params.noteId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// COMMANDS
router.post('/projects/:id/commands', (req, res, next) => {
  try {
    sqlite.addCommandData(req.params.id, req.body);
    res.status(201).json({ message: 'Command added' });
  } catch (err) {
    next(err);
  }
});

router.delete('/commands/:commandId', (req, res, next) => {
  try {
    sqlite.deleteCommandData(req.params.commandId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// RESOURCES
router.post('/projects/:id/resources', (req, res, next) => {
  try {
    sqlite.addResourceData(req.params.id, req.body);
    res.status(201).json({ message: 'Resource added' });
  } catch (err) {
    next(err);
  }
});

router.delete('/resources/:resourceId', (req, res, next) => {
  try {
    sqlite.deleteResourceData(req.params.resourceId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// LOGS & TIMERS
router.post('/projects/:id/logs', (req, res, next) => {
  try {
    sqlite.addLogData(req.params.id, req.body);
    res.status(201).json({ message: 'Log added' });
  } catch (err) {
    next(err);
  }
});

router.delete('/projects/:id/logs', (req, res, next) => {
  try {
    sqlite.clearLogsData(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.put('/projects/:id/timer', (req, res, next) => {
  try {
    sqlite.updateTimerData(req.params.id, req.body);
    res.json({ message: 'Timer updated' });
  } catch (err) {
    next(err);
  }
});

export default router;

