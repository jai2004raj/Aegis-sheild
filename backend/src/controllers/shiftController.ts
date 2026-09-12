import { Request, Response } from 'express';
import Shift from '../models/Shift';

// @desc    Get all shifts
// @route   GET /api/shifts
export const getShifts = async (req: Request, res: Response): Promise<void> => {
  try {
    const shifts = await Shift.find().sort({ startTime: 1 });
    res.status(200).json({ count: shifts.length, shifts });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching shifts.' });
  }
};

// @desc    Create new shift (Admin)
// @route   POST /api/shifts
export const createShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, startTime, endTime, description } = req.body;

    if (!name || !startTime || !endTime) {
      res.status(400).json({ message: 'Name, start time, and end time are required.' });
      return;
    }

    const newShift = await Shift.create({
      name,
      startTime,
      endTime,
      description,
    });

    res.status(201).json({ message: 'Shift created successfully.', shift: newShift });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating shift.' });
  }
};
