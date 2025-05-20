import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: string;
  status: string;
  filePath: string;
  uploadedBy: mongoose.Types.ObjectId;
  department: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['document', 'code', 'tool'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model<IResource>('Resource', resourceSchema); 