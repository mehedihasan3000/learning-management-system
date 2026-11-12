import { Schema, model, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      default: 'System Administrator',
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin'],
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = model<IAdmin>('Admin', adminSchema);

