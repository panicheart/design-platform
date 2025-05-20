import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  department: string;
  dueDate: Date;
  tags: string[];
  comments: Array<{
    content: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  tags: [{
    type: String,
  }],
  comments: [{
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model<ITask>('Task', taskSchema); 