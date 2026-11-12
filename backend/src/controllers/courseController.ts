import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/Course';
import { Lecture } from '../models/Lecture';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    // Attach lecture counts to each course
    const courseIds = courses.map((c) => c._id);
    const lectureCounts = await Lecture.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      lectureCounts.map((item) => [item._id.toString(), item.count])
    );

    const coursesWithCount = courses.map((course) => ({
      ...course,
      id: course._id,
      lectureCount: countMap.get(course._id.toString()) || 0,
    }));

    res.status(200).json({
      success: true,
      data: coursesWithCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message,
    });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
      return;
    }

    const course = await Course.findById(id).lean();

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    const lectures = await Lecture.find({ courseId: id }).sort({ order: 1, createdAt: 1 }).lean();

    res.status(200).json({
      success: true,
      data: {
        ...course,
        id: course._id,
        lectures: lectures.map((lec) => ({ ...lec, id: lec._id })),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details',
      error: error.message,
    });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, thumbnail } = req.body;

    if (!title || !description || price === undefined || !thumbnail) {
      res.status(400).json({
        success: false,
        message: 'Title, description, price, and thumbnail are required fields.',
      });
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number.',
      });
      return;
    }

    const newCourse = await Course.create({
      title: String(title).trim(),
      description: String(description).trim(),
      price: numericPrice,
      thumbnail: String(thumbnail).trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        ...newCourse.toObject(),
        id: newCourse._id,
        lectureCount: 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message,
    });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
      return;
    }

    const { title, description, price, thumbnail } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        res.status(400).json({
          success: false,
          message: 'Price must be a valid non-negative number.',
        });
        return;
      }
      updateData.price = numericPrice;
    }
    if (thumbnail !== undefined) updateData.thumbnail = String(thumbnail).trim();

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedCourse) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: {
        ...updatedCourse,
        id: updatedCourse._id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message,
    });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
      return;
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Cascade delete associated lectures
    const deleteResult = await Lecture.deleteMany({ courseId: id });

    res.status(200).json({
      success: true,
      message: `Course and ${deleteResult.deletedCount} associated lectures deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message,
    });
  }
};
