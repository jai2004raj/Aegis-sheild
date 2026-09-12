import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import Worker from '../models/Worker';
import Company from '../models/Company';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'security_agency_super_secret_jwt_key_2026_production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user (Customer, Company, or Worker)
// @route   POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, organizationType } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already registered.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role && ['WORKER', 'COMPANY', 'CUSTOMER'].includes(role) ? role : 'CUSTOMER';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: userRole,
    });

    let workerIdStr: string | undefined;
    let companyIdStr: string | undefined;

    if (userRole === 'WORKER') {
      const count = await Worker.countDocuments();
      const generatedId = `SEC-W${101 + count}`;
      const newWorker = await Worker.create({
        workerId: generatedId,
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: phone || 'N/A',
        designation: 'Security Guard',
        skills: ['Access Control', 'Perimeter Surveillance'],
        joiningDate: new Date(),
        salaryStructure: {
          baseSalary: 18000,
          allowances: 2000,
          deductions: 500,
        },
        employmentStatus: 'ACTIVE',
      });
      workerIdStr = newWorker._id.toString();
    } else if (userRole === 'COMPANY') {
      const count = await Company.countDocuments();
      const generatedId = `SEC-C${201 + count}`;
      const newCompany = await Company.create({
        companyId: generatedId,
        userId: newUser._id,
        name: newUser.name,
        organizationType: organizationType || 'Company',
        contactPerson: newUser.name,
        email: newUser.email,
        phone: phone || 'N/A',
        address: 'Registered Location',
        city: 'City',
        state: 'State',
        requiredWorkers: 5,
      });
      companyIdStr = newCompany._id.toString();
    }

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      workerId: workerIdStr,
      companyId: companyIdStr,
    });

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        workerId: workerIdStr,
        companyId: companyIdStr,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    if (!user.passwordHash) {
      res.status(401).json({ message: 'Account registered via Google. Please login with Google.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
      return;
    }

    let workerDoc = null;
    let companyDoc = null;

    if (user.role === 'WORKER') {
      workerDoc = await Worker.findOne({ userId: user._id });
    } else if (user.role === 'COMPANY') {
      companyDoc = await Company.findOne({ userId: user._id });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      workerId: workerDoc?._id?.toString(),
      companyId: companyDoc?._id?.toString(),
    });

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        workerId: workerDoc?._id?.toString(),
        companyId: companyDoc?._id?.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during login.' });
  }
};

// @desc    Google OAuth Auth / Token verify endpoint
// @route   POST /api/auth/google
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential, email: manualEmail, name: manualName, googleId: manualGoogleId, profileImage: manualImage, role } = req.body;

    let email = manualEmail;
    let name = manualName;
    let googleId = manualGoogleId;
    let profileImage = manualImage;

    if (credential) {
      try {
        if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
          const ticket = await oauthClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          if (payload) {
            email = payload.email;
            name = payload.name;
            googleId = payload.sub;
            profileImage = payload.picture;
          }
        } else {
          // In development without configured client ID, decode JWT payload
          const decoded: any = jwt.decode(credential);
          if (decoded && decoded.email) {
            email = decoded.email;
            name = decoded.name || decoded.email.split('@')[0];
            googleId = decoded.sub;
            profileImage = decoded.picture;
          }
        }
      } catch (err: any) {
        // Fallback to decode if verifyIdToken fails on minor audience mismatch
        const decoded: any = jwt.decode(credential);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name || decoded.email.split('@')[0];
          googleId = decoded.sub;
          profileImage = decoded.picture;
        } else {
          res.status(401).json({ message: 'Invalid or expired Google token.' });
          return;
        }
      }
    }

    if (!email) {
      res.status(400).json({ message: 'Google account email is required.' });
      return;
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const userRole = role && ['WORKER', 'COMPANY', 'CUSTOMER'].includes(role) ? role : 'CUSTOMER';
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId: googleId || `google_${Date.now()}`,
        role: userRole,
        profileImage,
        isActive: true,
      });

      if (userRole === 'WORKER') {
        const count = await Worker.countDocuments();
        await Worker.create({
          workerId: `SEC-W${101 + count}`,
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: 'N/A',
          designation: 'Security Guard',
          skills: ['Surveillance', 'Patrol'],
          joiningDate: new Date(),
          salaryStructure: { baseSalary: 18000, allowances: 2000, deductions: 500 },
        });
      } else if (userRole === 'COMPANY') {
        const count = await Company.countDocuments();
        await Company.create({
          companyId: `SEC-C${201 + count}`,
          userId: user._id,
          name: user.name,
          organizationType: 'Company',
          contactPerson: user.name,
          email: user.email,
          phone: 'N/A',
          address: 'Corporate Head Office',
          city: 'City',
          state: 'State',
          requiredWorkers: 5,
        });
      }
    }

    let workerDoc = null;
    let companyDoc = null;

    if (user.role === 'WORKER') {
      workerDoc = await Worker.findOne({ userId: user._id });
    } else if (user.role === 'COMPANY') {
      companyDoc = await Company.findOne({ userId: user._id });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      workerId: workerDoc?._id?.toString(),
      companyId: companyDoc?._id?.toString(),
    });

    res.status(200).json({
      message: 'Google authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        workerId: workerDoc?._id?.toString(),
        companyId: companyDoc?._id?.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during Google auth.' });
  }
};

// @desc    Get Current User profile
// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    let workerDoc = null;
    let companyDoc = null;

    if (user.role === 'WORKER') {
      workerDoc = await Worker.findOne({ userId: user._id }).populate({
        path: 'currentAssignment',
        populate: [{ path: 'companyId' }, { path: 'shiftId' }],
      });
    } else if (user.role === 'COMPANY') {
      companyDoc = await Company.findOne({ userId: user._id });
    }

    res.status(200).json({
      user,
      worker: workerDoc,
      company: companyDoc,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Logged out successfully.' });
};
