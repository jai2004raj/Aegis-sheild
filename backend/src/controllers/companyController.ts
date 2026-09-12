import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Company from '../models/Company';
import User from '../models/User';
import Worker from '../models/Worker';
import Assignment from '../models/Assignment';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../types';
import { sendCredentialsEmail } from '../utils/emailService';

// @desc    Get all companies
// @route   GET /api/companies
export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, type, status } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.organizationType = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyId: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }

    const companies = await Company.find(filter).sort({ createdAt: -1 });

    // Populate dynamic active workers count for each company
    const enrichedCompanies = await Promise.all(
      companies.map(async (company) => {
        const activeWorkersCount = await Assignment.countDocuments({
          companyId: company._id,
          status: 'ACTIVE',
        });
        return {
          ...company.toObject(),
          activeWorkersCount,
        };
      })
    );

    res.status(200).json({ count: enrichedCompanies.length, companies: enrichedCompanies });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching companies.' });
  }
};

// @desc    Get single company details
// @route   GET /api/companies/:id
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: 'Company not found.' });
      return;
    }

    const activeAssignments = await Assignment.find({
      companyId: company._id,
      status: 'ACTIVE',
    })
      .populate('workerId')
      .populate('shiftId');

    const totalActiveWorkers = activeAssignments.length;

    // Today's attendance at this company
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.find({
      companyId: company._id,
      date: todayStr,
    }).populate('workerId', 'name designation phone');

    res.status(200).json({
      company: {
        ...company.toObject(),
        activeWorkersCount: totalActiveWorkers,
      },
      activeAssignments,
      todayAttendance,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching company details.' });
  }
};

// @desc    Register new company (Admin)
// @route   POST /api/companies
export const createCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      organizationType,
      contactPerson,
      email,
      phone,
      password,
      address,
      city,
      state,
      postalCode,
      requiredWorkers,
      workingHours,
      requiredShift,
    } = req.body;

    if (!name || !contactPerson || !email || !phone || !city) {
      res.status(400).json({ message: 'Name, contact person, email, phone, and city are required.' });
      return;
    }

    const count = await Company.countDocuments();
    const companyId = `SEC-C${201 + count}`;

    const plainPassword = password && password.trim() ? password.trim() : 'Company@123';
    let userIdStr;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(plainPassword, salt);

      const newUser = await User.create({
        name: contactPerson,
        email: email.toLowerCase(),
        passwordHash,
        phone,
        role: 'COMPANY',
      });
      userIdStr = newUser._id;
    } else {
      userIdStr = existingUser._id;
    }

    const newCompany = await Company.create({
      companyId,
      userId: userIdStr,
      name,
      organizationType: organizationType || 'Company',
      contactPerson,
      email: email.toLowerCase(),
      phone,
      address: address || 'Default Address',
      city,
      state: state || 'State',
      postalCode,
      requiredWorkers: Number(requiredWorkers) || 5,
      workingHours: Number(workingHours) || 8,
      requiredShift: requiredShift || 'Day & Night (24x7)',
      status: 'ACTIVE',
    });

    // Dispatch credentials email to the registered company email address
    sendCredentialsEmail({
      to: newCompany.email,
      recipientName: newCompany.contactPerson,
      role: 'COMPANY',
      id: newCompany.companyId,
      email: newCompany.email,
      password: plainPassword,
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    }).catch((err) => {
      console.error('[CompanyController] Error dispatching credentials email:', err);
    });

    res.status(201).json({
      message: 'Company registered successfully.',
      company: newCompany,
      credentials: {
        companyId: newCompany.companyId,
        name: newCompany.name,
        contactPerson: newCompany.contactPerson,
        email: newCompany.email,
        phone: newCompany.phone,
        password: plainPassword,
        role: 'COMPANY',
        organizationType: newCompany.organizationType,
        loginUrl: '/login',
      },
      emailSent: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating company.' });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: 'Company not found.' });
      return;
    }

    const {
      name,
      organizationType,
      contactPerson,
      phone,
      address,
      city,
      state,
      requiredWorkers,
      status,
      requiredShift,
    } = req.body;

    if (name) company.name = name;
    if (organizationType) company.organizationType = organizationType;
    if (contactPerson) company.contactPerson = contactPerson;
    if (phone) company.phone = phone;
    if (address) company.address = address;
    if (city) company.city = city;
    if (state) company.state = state;
    if (requiredWorkers !== undefined) company.requiredWorkers = Number(requiredWorkers);
    if (status) company.status = status;
    if (requiredShift) company.requiredShift = requiredShift;

    await company.save();

    res.status(200).json({ message: 'Company updated successfully.', company });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating company.' });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: 'Company not found.' });
      return;
    }

    if (company.userId) {
      await User.findByIdAndDelete(company.userId);
    }

    await Assignment.deleteMany({ companyId: company._id });
    await Attendance.deleteMany({ companyId: company._id });
    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Company deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting company.' });
  }
};
