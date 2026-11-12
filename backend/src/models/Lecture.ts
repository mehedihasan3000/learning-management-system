import { Schema, model, Document, Types } from 'mongoose';

export interface ILecture extends Document {
  courseId: Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new Schema<ILecture>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Lecture must belong to a Course'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Lecture description is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    duration: {
      type: String,
      trim: true,
      default: '10:00',
    },
  },
  {
    timestamps: true,
  }
);

export const Lecture = model<ILecture>('Lecture', lectureSchema);

