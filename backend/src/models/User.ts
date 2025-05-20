import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  department: string;
  position: string;
  avatar?: string;
  phone?: string;
  status: string;
  lastLogin?: Date;
  permissions: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // 默认不返回密码字段
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{11}$/, 'Please provide a valid phone number']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: {
    type: Date
  },
  permissions: [{
    type: String,
    enum: [
      'read:resources',
      'write:resources',
      'read:tasks',
      'write:tasks',
      'manage:users',
      'manage:system'
    ]
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 根据角色设置默认权限
userSchema.pre('save', function(next) {
  if (this.isNew) {
    switch (this.role) {
      case 'admin':
        this.permissions = [
          'read:resources',
          'write:resources',
          'read:tasks',
          'write:tasks',
          'manage:users',
          'manage:system'
        ];
        break;
      case 'manager':
        this.permissions = [
          'read:resources',
          'write:resources',
          'read:tasks',
          'write:tasks',
          'manage:users'
        ];
        break;
      case 'user':
        this.permissions = [
          'read:resources',
          'read:tasks',
          'write:tasks'
        ];
        break;
    }
  }
  next();
});

export default mongoose.model<IUser>('User', userSchema); 