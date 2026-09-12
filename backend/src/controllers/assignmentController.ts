import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import Worker from '../models/Worker';
import Company from '../models/Company';
import Shift from '../models/Shift';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';

// @desc    Get all assignments
// @route   GET /api/assignments
export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workerId, companyId, status } = req.query;

    const filter: any = {};
    if (workerId) filter.workerId = workerId;
    if (companyId) filter.companyId = companyId;
    if (status) filter.status = status;

    const assignments = await Assignment.find(filter)
      .populate('workerId', 'name workerId designation phone email employmentStatus')
      .populate('companyId', 'name companyId organizationType city address')
      .populate('shiftId', 'name startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: assignments.length, assignments });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching assignments.' });
  }
};

// @desc    Assign or transfer a worker to a company/shift
// @route   POST /api/assignments
export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workerId, companyId, position, shiftId, startDate, endDate, notes } = req.body;

    if (!workerId || !companyId || !shiftId) {
      res.status(400).json({ message: 'Worker, company, and shift are required.' });
      return;
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      res.status(404).json({ message: 'Worker not found.' });
      return;
    }

    const company = await Company.findById(companyId);
    if (!company) {
      res.status(404).json({ message: 'Company not found.' });
      return;
    }

    const shift = await Shift.findById(shiftId);
    if (!shift) {
      res.status(404).json({ message: 'Shift not found.' });
      return;
    }

    // Check if worker already has an active assignment
    const existingActiveAssignment = await Assignment.findOne({
      workerId: worker._id,
      status: 'ACTIVE',
    }).populate('companyId', 'name');

    if (existingActiveAssignment) {
      // Mark old assignment as TRANSFERRED
      existingActiveAssignment.status = 'TRANSFERRED';
      existingActiveAssignment.endDate = new Date();
      await existingActiveAssignment.save();
    }

    // Create new assignment
    const newAssignment = await Assignment.create({
      workerId: worker._id,
      companyId: company._id,
      position: position || worker.designation || 'Security Personnel',
      shiftId: shift._id,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      status: 'ACTIVE',
      assignedBy: req.user?.id,
      notes,
    });

    // Update worker's current assignment reference and status
    worker.currentAssignment = newAssignment._id;
    worker.employmentStatus = 'ACTIVE';
    await worker.save();

    // Send Notification to Worker
    const isTransfer = !!existingActiveAssignment;
    const notifTitle = isTransfer ? 'Workplace Transfer Update' : 'New Security Duty Assignment';
    const notifMsg = isTransfer
      ? `You have been transferred to ${company.name} (${position || 'Security Duty'}) for the ${shift.name} shift starting ${new Date(startDate || Date.now()).toLocaleDateString()}.`
      : `You have been assigned to ${company.name} (${position || 'Security Duty'}) for the ${shift.name} shift starting ${new Date(startDate || Date.now()).toLocaleDateString()}.`;

    await Notification.create({
      recipientId: worker.userId,
      title: notifTitle,
      message: notifMsg,
      type: isTransfer ? 'TRANSFER' : 'ASSIGNMENT',
    });

    res.status(201).json({
      message: isTransfer ? 'Worker transferred successfully.' : 'Worker assigned successfully.',
      assignment: newAssignment,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating assignment.' });
  }
};

// @desc    Update or terminate assignment
// @route   PUT /api/assignments/:id
export const updateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, endDate, position, notes } = req.body;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found.' });
      return;
    }

    if (position) assignment.position = position;
    if (notes !== undefined) assignment.notes = notes;

    if (status && status !== assignment.status) {
      assignment.status = status;
      if (['COMPLETED', 'TRANSFERRED', 'CANCELLED'].includes(status)) {
        assignment.endDate = endDate ? new Date(endDate) : new Date();

        // Clear current assignment from worker if this was active
        const worker = await Worker.findById(assignment.workerId);
        if (worker && worker.currentAssignment?.toString() === assignment._id.toString()) {
          worker.currentAssignment = undefined;
          await worker.save();
        }
      }
    }

    await assignment.save();

    res.status(200).json({ message: 'Assignment updated.', assignment });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating assignment.' });
  }
};
