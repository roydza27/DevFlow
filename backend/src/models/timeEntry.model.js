import { Schema, model } from 'mongoose';

const timeEntrySchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', default: null },
    startedAt: { type: Date, required: true },
    stoppedAt: { type: Date, default: null },
    accumulated: { type: Number, default: 0 }, // elapsed seconds
  },
  { timestamps: true }
);

export default model('TimeEntry', timeEntrySchema);
