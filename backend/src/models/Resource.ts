import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: string;
  category: string;
  status: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: mongoose.Types.ObjectId;
  department: string;
  tags: string[];
  version: number;
  metadata: {
    [key: string]: any;
  };
  accessControl: {
    isPublic: boolean;
    allowedDepartments: string[];
    allowedRoles: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['document', 'code', 'tool', 'template', 'reference'],
    required: true
  },
  category: {
    type: String,
    enum: ['design', 'development', 'testing', 'documentation', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  version: {
    type: Number,
    default: 1
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  accessControl: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowedDepartments: [{
      type: String,
      trim: true
    }],
    allowedRoles: [{
      type: String,
      enum: ['admin', 'manager', 'user']
    }]
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// 索引
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ type: 1, category: 1 });
resourceSchema.index({ department: 1, status: 1 });
resourceSchema.index({ uploadedBy: 1, createdAt: -1 });

// 版本控制中间件
resourceSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  next();
});

export default mongoose.model<IResource>('Resource', resourceSchema); 