import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Worker from '../models/Worker';
import User from '../models/User';
import Assignment from '../models/Assignment';
import Attendance from '../models/Attendance';
import Salary from '../models/Salary';
import { AuthRequest } from '../types';
import { sendCredentialsEmail } from '../utils/emailService';

// @desc    Get all workers with search, filter & pagination
// @route   GET /api/workers
export const getWorkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, designation } = req.query;

    const filter: any = {};

    if (status) {
      filter.employmentStatus = status;
    }

    if (designation) {
      filter.designation = designation;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { workerId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const workers = await Worker.find(filter)
      .populate('userId', 'name email role phone profileImage')
      .populate({
        path: 'currentAssignment',
        populate: [{ path: 'companyId' }, { path: 'shiftId' }],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: workers.length, workers });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching workers.' });
  }
};

// @desc    Get single worker by ID
// @route   GET /api/workers/:id
export const getWorkerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'name email phone profileImage role')
      .populate({
        path: 'currentAssignment',
        populate: [{ path: 'companyId' }, { path: 'shiftId' }],
      });

    if (!worker) {
      res.status(404).json({ message: 'Worker not found.' });
      return;
    }

    // Get historical assignments
    const assignmentHistory = await Assignment.find({ workerId: worker._id })
      .populate('companyId', 'name organizationType city')
      .populate('shiftId', 'name startTime endTime')
      .sort({ startDate: -1 });

    // Get recent attendance logs
    const recentAttendance = await Attendance.find({ workerId: worker._id })
      .populate('companyId', 'name')
      .sort({ date: -1 })
      .limit(10);

    // Get salary history
    const salaryHistory = await Salary.find({ workerId: worker._id }).sort({ year: -1, month: -1 });

    res.status(200).json({
      worker,
      assignmentHistory,
      recentAttendance,
      salaryHistory,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching worker details.' });
  }
};

// @desc    Create new worker (Admin)
// @route   POST /api/workers
export const createWorker = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      password,
      designation,
      skills,
      joiningDate,
      experience,
      address,
      emergencyContact,
      gender,
      dateOfBirth,
      baseSalary,
      allowances,
      deductions,
      profileImage,
      photo,
    } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ message: 'Name, email, and phone are required.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'A user with this email already exists.' });
      return;
    }

    // Generate worker ID
    const count = await Worker.countDocuments();
    const workerId = `SEC-W${101 + count}`;

    const plainPassword = password && password.trim() ? password.trim() : 'Worker@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);
    const image = photo || profileImage || '';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: 'WORKER',
      profileImage: image || undefined,
    });

    const newWorker = await Worker.create({
      workerId,
      userId: newUser._id,
      name,
      email: email.toLowerCase(),
      phone,
      address,
      emergencyContact,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      designation: designation || 'Security Guard',
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s: string) => s.trim()) : ['General Security'],
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      experience: experience || '1 Year',
      salaryStructure: {
        baseSalary: Number(baseSalary) || 18000,
        allowances: Number(allowances) || 2000,
        deductions: Number(deductions) || 500,
      },
      employmentStatus: 'ACTIVE',
      profileImage: image || undefined,
      photo: image || undefined,
    });

    // Dispatch credentials email to worker's registered email address
    sendCredentialsEmail({
      to: newWorker.email,
      recipientName: newWorker.name,
      role: 'WORKER',
      id: newWorker.workerId,
      email: newWorker.email,
      password: plainPassword,
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    }).catch((err) => {
      console.error('[WorkerController] Error dispatching credentials email:', err);
    });

    res.status(201).json({
      message: 'Worker registered successfully.',
      worker: newWorker,
      credentials: {
        workerId: newWorker.workerId,
        name: newWorker.name,
        email: newWorker.email,
        phone: newWorker.phone,
        password: plainPassword,
        role: 'WORKER',
        designation: newWorker.designation,
        loginUrl: '/login',
      },
      emailSent: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating worker.' });
  }
};

// @desc    Update worker details
// @route   PUT /api/workers/:id
export const updateWorker = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      phone,
      designation,
      skills,
      experience,
      employmentStatus,
      baseSalary,
      allowances,
      deductions,
      address,
      emergencyContact,
      profileImage,
      photo,
    } = req.body;

    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      res.status(404).json({ message: 'Worker not found.' });
      return;
    }

    if (name) worker.name = name;
    if (phone) worker.phone = phone;
    if (designation) worker.designation = designation;
    if (skills) worker.skills = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim());
    if (experience) worker.experience = experience;
    if (employmentStatus) worker.employmentStatus = employmentStatus;
    if (address !== undefined) worker.address = address;
    if (emergencyContact !== undefined) worker.emergencyContact = emergencyContact;

    const updatedImage = photo !== undefined ? photo : profileImage;
    if (updatedImage !== undefined) {
      worker.profileImage = updatedImage;
      worker.photo = updatedImage;
    }

    if (baseSalary !== undefined || allowances !== undefined || deductions !== undefined) {
      worker.salaryStructure = {
        baseSalary: baseSalary !== undefined ? Number(baseSalary) : worker.salaryStructure.baseSalary,
        allowances: allowances !== undefined ? Number(allowances) : worker.salaryStructure.allowances,
        deductions: deductions !== undefined ? Number(deductions) : worker.salaryStructure.deductions,
      };
    }

    await worker.save();

    // Also update associated User name/phone/profileImage
    const userUpdates: any = { name: worker.name, phone: worker.phone };
    if (updatedImage !== undefined) {
      userUpdates.profileImage = updatedImage;
    }
    await User.findByIdAndUpdate(worker.userId, userUpdates);

    res.status(200).json({ message: 'Worker details updated.', worker });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating worker.' });
  }
};

// @desc    Delete worker (Admin)
// @route   DELETE /api/workers/:id
export const deleteWorker = async (req: Request, res: Response): Promise<void> => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      res.status(404).json({ message: 'Worker not found.' });
      return;
    }

    // Delete associated User and cleanup assignments
    await User.findByIdAndDelete(worker.userId);
    await Assignment.deleteMany({ workerId: worker._id });
    await Attendance.deleteMany({ workerId: worker._id });
    await Salary.deleteMany({ workerId: worker._id });
    await Worker.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Worker and associated data deleted.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting worker.' });
  }
};
