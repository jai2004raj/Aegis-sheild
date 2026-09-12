import { Response } from 'express';
import Attendance from '../models/Attendance';
import Worker from '../models/Worker';
import Company from '../models/Company';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../types';

// @desc    Worker Check-In for duty
// @route   POST /api/attendance/check-in
export const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let workerIdStr = req.user?.workerId;

    if (!workerIdStr) {
      const workerDoc = await Worker.findOne({ userId: req.user?.id });
      if (!workerDoc) {
        res.status(404).json({ message: 'Worker profile not found.' });
        return;
      }
      workerIdStr = workerDoc._id.toString();
    }

    const worker = await Worker.findById(workerIdStr).populate({
      path: 'currentAssignment',
      populate: [{ path: 'companyId' }, { path: 'shiftId' }],
    });

    if (!worker || !worker.currentAssignment) {
      res.status(400).json({ message: 'You have no active company assignment to check in for.' });
      return;
    }

    const activeAssignment: any = worker.currentAssignment;
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if worker already checked in today
    const existingAttendance = await Attendance.findOne({
      workerId: worker._id,
      date: todayStr,
    });

    if (existingAttendance) {
      res.status(400).json({
        message: `You have already checked in for today (${todayStr}). Login time: ${new Date(
          existingAttendance.loginTime
        ).toLocaleTimeString()}`,
      });
      return;
    }

    const newAttendance = await Attendance.create({
      workerId: worker._id,
      companyId: activeAssignment.companyId._id,
      date: todayStr,
      loginTime: new Date(),
      status: 'PRESENT',
    });

    res.status(201).json({
      message: `Duty Check-In successful at ${new Date().toLocaleTimeString()}! Station: ${
        activeAssignment.companyId.name
      }`,
      attendance: newAttendance,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Check-in failed.' });
  }
};

// @desc    Worker Check-Out from duty
// @route   POST /api/attendance/check-out
export const checkOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let workerIdStr = req.user?.workerId;

    if (!workerIdStr) {
      const workerDoc = await Worker.findOne({ userId: req.user?.id });
      if (!workerDoc) {
        res.status(404).json({ message: 'Worker profile not found.' });
        return;
      }
      workerIdStr = workerDoc._id.toString();
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({
      workerId: workerIdStr,
      date: todayStr,
    });

    if (!attendance) {
      res.status(400).json({ message: 'No check-in record found for today. Please check in first.' });
      return;
    }

    if (attendance.logoutTime) {
      res.status(400).json({
        message: `You have already checked out for today at ${new Date(
          attendance.logoutTime
        ).toLocaleTimeString()}.`,
      });
      return;
    }

    const logoutTime = new Date();
    const loginTime = new Date(attendance.loginTime);

    // Calculate total hours
    const diffMs = logoutTime.getTime() - loginTime.getTime();
    const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

    attendance.logoutTime = logoutTime;
    attendance.totalHours = hours;
    await attendance.save();

    res.status(200).json({
      message: `Duty Check-Out recorded successfully. Total working hours logged: ${hours} hrs.`,
      attendance,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Check-out failed.' });
  }
};

// @desc    Get Attendance records (Filtered for Admin/Worker/Company)
// @route   GET /api/attendance
export const getAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date, workerId, companyId, status, month } = req.query;

    const filter: any = {};

    if (date) filter.date = date;
    if (status) filter.status = status;
    if (workerId) filter.workerId = workerId;
    if (companyId) filter.companyId = companyId;

    // Role-specific scoping
    if (req.user?.role === 'WORKER') {
      const workerDoc = await Worker.findOne({ userId: req.user.id });
      if (workerDoc) {
        filter.workerId = workerDoc._id;
      }
    } else if (req.user?.role === 'COMPANY') {
      const companyDoc = await Company.findOne({ userId: req.user.id });
      if (companyDoc) {
        filter.companyId = companyDoc._id;
      }
    }

    if (month) {
      filter.date = { $regex: `^${month}` }; // e.g. "2026-09"
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate('workerId', 'name workerId designation phone profileImage')
      .populate('companyId', 'name companyId organizationType city')
      .sort({ date: -1, loginTime: -1 });

    res.status(200).json({ count: attendanceRecords.length, attendance: attendanceRecords });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching attendance logs.' });
  }
};
