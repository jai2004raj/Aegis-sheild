import { Request, Response } from 'express';
import Salary from '../models/Salary';
import Worker from '../models/Worker';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';

// @desc    Get Salaries (Admin/Worker)
// @route   GET /api/salaries
export const getSalaries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workerId, month, year, paymentStatus } = req.query;

    const filter: any = {};
    if (workerId) filter.workerId = workerId;
    if (month) filter.month = month;
    if (year) filter.year = Number(year);
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (req.user?.role === 'WORKER') {
      const workerDoc = await Worker.findOne({ userId: req.user.id });
      if (workerDoc) {
        filter.workerId = workerDoc._id;
      }
    }

    const salaries = await Salary.find(filter)
      .populate('workerId', 'name workerId designation phone email salaryStructure')
      .sort({ year: -1, month: -1 });

    res.status(200).json({ count: salaries.length, salaries });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching salary records.' });
  }
};

// @desc    Create or Update Salary Record (Admin)
// @route   POST /api/salaries
export const createSalary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workerId, month, year, basicSalary, allowances, overtime, deductions, paymentStatus, notes } = req.body;

    if (!workerId || !month || !year) {
      res.status(400).json({ message: 'Worker ID, month, and year are required.' });
      return;
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      res.status(404).json({ message: 'Worker not found.' });
      return;
    }

    const basic = Number(basicSalary) || worker.salaryStructure?.baseSalary || 18000;
    const allow = Number(allowances) !== undefined ? Number(allowances) : worker.salaryStructure?.allowances || 2000;
    const over = Number(overtime) || 0;
    const ded = Number(deductions) !== undefined ? Number(deductions) : worker.salaryStructure?.deductions || 500;

    const netSalary = basic + allow + over - ded;

    const existingSalary = await Salary.findOne({ workerId: worker._id, month, year: Number(year) });

    let salaryDoc;

    if (existingSalary) {
      existingSalary.basicSalary = basic;
      existingSalary.allowances = allow;
      existingSalary.overtime = over;
      existingSalary.deductions = ded;
      existingSalary.netSalary = netSalary;
      if (paymentStatus) {
        existingSalary.paymentStatus = paymentStatus;
        if (paymentStatus === 'PAID') existingSalary.paymentDate = new Date();
      }
      if (notes) existingSalary.notes = notes;
      await existingSalary.save();
      salaryDoc = existingSalary;
    } else {
      salaryDoc = await Salary.create({
        workerId: worker._id,
        month,
        year: Number(year),
        basicSalary: basic,
        allowances: allow,
        overtime: over,
        deductions: ded,
        netSalary,
        paymentStatus: paymentStatus || 'PENDING',
        paymentDate: paymentStatus === 'PAID' ? new Date() : undefined,
        notes,
      });
    }

    // Notify worker
    await Notification.create({
      recipientId: worker.userId,
      title: `Salary Statement (${month} ${year})`,
      message: `Your salary for ${month} ${year} has been processed. Net Amount: ₹${netSalary.toLocaleString()}. Status: ${salaryDoc.paymentStatus}.`,
      type: 'SALARY',
    });

    res.status(201).json({ message: 'Salary record saved successfully.', salary: salaryDoc });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error processing salary.' });
  }
};

// @desc    Update Salary payment status (Admin)
// @route   PUT /api/salaries/:id
export const updateSalaryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentStatus } = req.body;

    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      res.status(404).json({ message: 'Salary record not found.' });
      return;
    }

    salary.paymentStatus = paymentStatus;
    if (paymentStatus === 'PAID') {
      salary.paymentDate = new Date();
    }
    await salary.save();

    res.status(200).json({ message: 'Salary payment status updated.', salary });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating salary status.' });
  }
};
