import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/Course';
import { Lecture } from '../models/Lecture';

export const getLecturesByCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
      return;
    }

    const lectures = await Lecture.find({ courseId }).sort({ order: 1, createdAt: 1 }).lean();

    res.status(200).json({
      success: true,
      data: lectures.map((l) => ({ ...l, id: l._id })),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lectures',
      error: error.message,
    });
  }
};

export const getLectureById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Lecture ID format',
      });
      return;
    }

    const lecture = await Lecture.findById(id).lean();

    if (!lecture) {
      res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...lecture,
        id: lecture._id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lecture',
      error: error.message,
    });
  }
};

export const createLecture = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;
    const { title, description, videoUrl, order, duration } = req.body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
      return;
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      res.status(404).json({
        success: false,
        message: 'Associated course not found.',
      });
      return;
    }

    if (!title || !description || !videoUrl) {
      res.status(400).json({
        success: false,
        message: 'Title, description, and video URL are required.',
      });
      return;
    }

    let lectureOrder = order !== undefined ? Number(order) : undefined;
    if (lectureOrder === undefined || isNaN(lectureOrder)) {
      const highestOrder = await Lecture.findOne({ courseId }).sort({ order: -1 }).select('order');
      lectureOrder = highestOrder ? highestOrder.order + 1 : 1;
    }

    const newLecture = await Lecture.create({
      courseId: new mongoose.Types.ObjectId(courseId),
      title: String(title).trim(),
      description: String(description).trim(),
      videoUrl: String(videoUrl).trim(),
      order: lectureOrder,
      duration: duration ? String(duration).trim() : '10:00',
    });

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: {
        ...newLecture.toObject(),
        id: newLecture._id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create lecture',
      error: error.message,
    });
  }
};

export const updateLecture = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Lecture ID format',
      });
      return;
    }

    const { title, description, videoUrl, order, duration } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (videoUrl !== undefined) updateData.videoUrl = String(videoUrl).trim();
    if (order !== undefined) updateData.order = Number(order);
    if (duration !== undefined) updateData.duration = String(duration).trim();

    const updatedLecture = await Lecture.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedLecture) {
      res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: {
        ...updatedLecture,
        id: updatedLecture._id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lecture',
      error: error.message,
    });
  }
};

export const deleteLecture = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Lecture ID format',
      });
      return;
    }

    const lecture = await Lecture.findByIdAndDelete(id);

    if (!lecture) {
      res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lecture',
      error: error.message,
    });
  }
};
