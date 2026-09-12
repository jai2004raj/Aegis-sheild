import { Request, Response } from 'express';
import Worker from '../models/Worker';
import Company from '../models/Company';
import Assignment from '../models/Assignment';
import Attendance from '../models/Attendance';
import Salary from '../models/Salary';
import ContactInquiry from '../models/ContactInquiry';

// @desc    Get Admin Dashboard Overview Stats
// @route   GET /api/reports/dashboard-stats
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const activeWorkers = await Worker.countDocuments({ employmentStatus: 'ACTIVE' });
    const workersOnLeave = await Worker.countDocuments({ employmentStatus: 'ON_LEAVE' });

    const totalCompanies = await Company.countDocuments();
    const activeCompanies = await Company.countDocuments({ status: 'ACTIVE' });

    const activeAssignments = await Assignment.countDocuments({ status: 'ACTIVE' });
    const unassignedWorkers = Math.max(0, activeWorkers - activeAssignments);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendanceCount = await Attendance.countDocuments({ date: todayStr, status: 'PRESENT' });

    const pendingInquiriesCount = await ContactInquiry.countDocuments({ status: 'NEW' });

    // Recent salary expenditure total
    const currentYear = new Date().getFullYear();
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    const monthSalaries = await Salary.find({ month: currentMonthName, year: currentYear });
    const totalSalaryExpense = monthSalaries.reduce((acc, s) => acc + s.netSalary, 0);

    // Distribution by Organization Type
    const companiesByType = await Company.aggregate([
      { $group: { _id: '$organizationType', count: { $sum: 1 } } },
    ]);

    // Monthly attendance overview
    const attendanceStats = await Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalWorkers,
      activeWorkers,
      workersOnLeave,
      totalCompanies,
      activeCompanies,
      activeAssignments,
      unassignedWorkers,
      todayAttendanceCount,
      pendingInquiriesCount,
      totalSalaryExpense,
      companiesByType,
      attendanceStats,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching dashboard stats.' });
  }
};
