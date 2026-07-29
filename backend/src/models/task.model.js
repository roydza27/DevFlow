import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['todo', 'doing', 'blocked', 'done'],
      default: 'todo',
    },
  },
  { timestamps: true }
);

export default model('Task', taskSchema);
