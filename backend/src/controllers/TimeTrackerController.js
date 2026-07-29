import TimeEntry from '../models/timeEntry.model.js';

export const getAllTimeEntries = async (req, res, next) => {
  try {
    const entries = await TimeEntry.find();
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

export const getTimeEntryById = async (req, res, next) => {
  try {
    const entry = await TimeEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Time entry not found' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

export const createTimeEntry = async (req, res, next) => {
  try {
    const entry = await TimeEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

export const updateTimeEntry = async (req, res, next) => {
  try {
    const entry = await TimeEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Time entry not found' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

export const deleteTimeEntry = async (req, res, next) => {
  try {
    const entry = await TimeEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Time entry not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
