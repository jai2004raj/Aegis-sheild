import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Worker from '../models/Worker';
import Company from '../models/Company';
import Shift from '../models/Shift';
import Assignment from '../models/Assignment';
import Attendance from '../models/Attendance';
import Salary from '../models/Salary';
import Notification from '../models/Notification';
import Review from '../models/Review';
import ContactInquiry from '../models/ContactInquiry';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/security_agency';

export const seedDatabase = async () => {
  try {
    console.log(`[Seed] Connecting to MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);

    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany({});
    await Worker.deleteMany({});
    await Company.deleteMany({});
    await Shift.deleteMany({});
    await Assignment.deleteMany({});
    await Attendance.deleteMany({});
    await Salary.deleteMany({});
    await Notification.deleteMany({});
    await Review.deleteMany({});
    await ContactInquiry.deleteMany({});

    console.log('[Seed] Creating Shifts...');
    const shifts = await Shift.insertMany([
      { name: 'Morning Shift', startTime: '06:00', endTime: '14:00', description: 'Early morning daylight security patrol' },
      { name: 'Evening Shift', startTime: '14:00', endTime: '22:00', description: 'Afternoon & peak activity surveillance' },
      { name: 'Night Shift', startTime: '22:00', endTime: '06:00', description: 'Overnight high-security protection & access control' },
    ]);

    const morningShift = shifts[0];
    const eveningShift = shifts[1];
    const nightShift = shifts[2];

    console.log('[Seed] Creating Default Admin User...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Password@123', salt);

    const adminUser = await User.create({
      name: 'Global Admin Manager',
      email: 'admin@securityagency.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+1 (555) 019-2831',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isActive: true,
    });

    console.log('[Seed] Creating Companies & Company Accounts...');
    const companyPasswordHash = await bcrypt.hash('Company@123', salt);

    const companiesData = [
      {
        name: 'ABC International School',
        type: 'School',
        contactPerson: 'Principal Robert Vance',
        email: 'contact@abcschool.org',
        phone: '+1 (555) 234-5678',
        address: '124 Education Avenue, Knowledge Park',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        requiredWorkers: 4,
        workingHours: 8,
        requiredShift: 'Day & Night (24x7)',
      },
      {
        name: 'Apex Tech Park & Towers',
        type: 'Company',
        contactPerson: 'Sarah Jenkins (Facilities Lead)',
        email: 'security@apextechpark.com',
        phone: '+1 (555) 876-5432',
        address: '800 Innovation Blvd, Tech Corridor',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10002',
        requiredWorkers: 8,
        workingHours: 8,
        requiredShift: '24x7 Rotating Shift',
      },
      {
        name: 'CityCare General Hospital',
        type: 'Hospital',
        contactPerson: 'Dr. Michael Chang',
        email: 'admin@citycarehospital.org',
        phone: '+1 (555) 345-6789',
        address: '50 Health Care Drive, Medical Zone',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10003',
        requiredWorkers: 6,
        workingHours: 8,
        requiredShift: '24x7 Emergency Guarding',
      },
      {
        name: 'Metro Center Shopping Mall',
        type: 'Mall',
        contactPerson: 'David Miller (Operations Manager)',
        email: 'ops@metromall.com',
        phone: '+1 (555) 654-3210',
        address: '99 Commercial Plaza, Downtown',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10004',
        requiredWorkers: 6,
        workingHours: 10,
        requiredShift: 'Day & Evening Shift',
      },
      {
        name: 'Horizon Luxury Apartments',
        type: 'Apartment',
        contactPerson: 'Elena Rostova (HOA President)',
        email: 'hoa@horizonluxury.com',
        phone: '+1 (555) 987-1234',
        address: '450 Waterfront Drive, Bay Area',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10005',
        requiredWorkers: 3,
        workingHours: 8,
        requiredShift: 'Night Patrol & Gate Guard',
      },
    ];

    const companies = [];
    for (let i = 0; i < companiesData.length; i++) {
      const item = companiesData[i];
      const compUser = await User.create({
        name: item.contactPerson,
        email: item.email,
        passwordHash: companyPasswordHash,
        role: 'COMPANY',
        phone: item.phone,
        isActive: true,
      });

      const comp = await Company.create({
        companyId: `SEC-C${201 + i}`,
        userId: compUser._id,
        name: item.name,
        organizationType: item.type as any,
        contactPerson: item.contactPerson,
        email: item.email,
        phone: item.phone,
        address: item.address,
        city: item.city,
        state: item.state,
        postalCode: item.postalCode,
        requiredWorkers: item.requiredWorkers,
        workingHours: item.workingHours,
        requiredShift: item.requiredShift,
        status: 'ACTIVE',
      });
      companies.push(comp);
    }

    console.log('[Seed] Creating 10 Workers & Worker Accounts...');
    const workerPasswordHash = await bcrypt.hash('Worker@123', salt);

    const rawWorkers = [
      { name: 'Ramesh Kumar', designation: 'Senior Security Guard', phone: '+1 (555) 111-2233', exp: '5 Years', skills: ['Access Control', 'Perimeter Patrol', 'First Aid'] },
      { name: 'Vikram Singh', designation: 'Security Supervisor', phone: '+1 (555) 222-3344', exp: '7 Years', skills: ['Team Leadership', 'CCTV Monitoring', 'Crisis Management'] },
      { name: 'Rajesh Sharma', designation: 'Armed Security Officer', phone: '+1 (555) 333-4455', exp: '6 Years', skills: ['Firearm Handling', 'VIP Protection', 'Escort'] },
      { name: 'Anita Desai', designation: 'Female Security Officer', phone: '+1 (555) 444-5566', exp: '3 Years', skills: ['Visitor Screening', 'Baggage Inspection', 'Customer Care'] },
      { name: 'Suresh Patel', designation: 'CCTV Surveillance Specialist', phone: '+1 (555) 555-6677', exp: '4 Years', skills: ['Control Room Ops', 'Incident Logging', 'Video Analytics'] },
      { name: 'Amit Verma', designation: 'Night Patrol Officer', phone: '+1 (555) 666-7788', exp: '4 Years', skills: ['Night Vision Patrol', 'Burglar Alarm Response'] },
      { name: 'Deepak Joshi', designation: 'Corporate Gate Guard', phone: '+1 (555) 777-8899', exp: '2 Years', skills: ['Badge Verification', 'Vehicle Log', 'Crowd Control'] },
      { name: 'Pooja Reddy', designation: 'Hospital Security Guard', phone: '+1 (555) 888-9900', exp: '3 Years', skills: ['ER Safety Protocol', 'De-escalation', 'Visitor Pass Management'] },
      { name: 'Manish Malhotra', designation: 'Warehouse Safety Officer', phone: '+1 (555) 999-0011', exp: '5 Years', skills: ['Cargo Inspection', 'Fire Safety', 'Inventory Security'] },
      { name: 'Karan Mehra', designation: 'Event Security Specialist', phone: '+1 (555) 000-1122', exp: '4 Years', skills: ['Crowd Management', 'Metal Detector Ops', 'Emergency Evacuation'] },
    ];

    const workers = [];
    for (let i = 0; i < rawWorkers.length; i++) {
      const item = rawWorkers[i];
      const email = `worker${i + 1}@securityagency.com`;

      const wUser = await User.create({
        name: item.name,
        email,
        passwordHash: workerPasswordHash,
        role: 'WORKER',
        phone: item.phone,
        isActive: true,
      });

      const wDoc = await Worker.create({
        workerId: `SEC-W${101 + i}`,
        userId: wUser._id,
        name: item.name,
        email,
        phone: item.phone,
        address: `${10 + i} Guard Security Colony, District 4`,
        emergencyContact: '+1 (555) 999-8877',
        gender: i % 2 === 0 ? 'Male' : 'Female',
        dateOfBirth: new Date(1990 + (i % 8), i % 12, 15),
        designation: item.designation,
        skills: item.skills,
        joiningDate: new Date(2024, i % 12, 1),
        experience: item.exp,
        salaryStructure: {
          baseSalary: 18000 + i * 1000,
          allowances: 2000,
          deductions: 500,
        },
        employmentStatus: 'ACTIVE',
      });
      workers.push(wDoc);
    }

    console.log('[Seed] Assigning Workers to Companies & Creating Assignments...');
    const assignments = [];
    for (let i = 0; i < workers.length; i++) {
      const companyIndex = i % companies.length;
      const shiftObj = i % 3 === 0 ? morningShift : i % 3 === 1 ? eveningShift : nightShift;

      const assign = await Assignment.create({
        workerId: workers[i]._id,
        companyId: companies[companyIndex]._id,
        position: workers[i].designation,
        shiftId: shiftObj._id,
        startDate: new Date(2026, 0, 1),
        status: 'ACTIVE',
        assignedBy: adminUser._id,
        notes: 'Primary security deployment',
      });

      workers[i].currentAssignment = assign._id;
      await workers[i].save();
      assignments.push(assign);
    }

    console.log('[Seed] Creating Attendance Logs for Today and Past Days...');
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < workers.length; i++) {
      const companyIndex = i % companies.length;
      // Attendance for today
      if (i < 8) {
        const login = new Date();
        login.setHours(7, 30 + i * 5, 0);
        await Attendance.create({
          workerId: workers[i]._id,
          companyId: companies[companyIndex]._id,
          date: todayStr,
          loginTime: login,
          logoutTime: i < 4 ? new Date(login.getTime() + 8 * 60 * 60 * 1000) : undefined,
          totalHours: i < 4 ? 8.0 : 0,
          status: 'PRESENT',
          notes: 'Punctual report for duty',
        });
      } else {
        await Attendance.create({
          workerId: workers[i]._id,
          companyId: companies[companyIndex]._id,
          date: todayStr,
          loginTime: new Date(),
          status: 'LEAVE',
          notes: 'Scheduled monthly leave',
        });
      }
    }

    console.log('[Seed] Generating Monthly Salary Paystubs...');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    for (let i = 0; i < workers.length; i++) {
      const w = workers[i];
      const basic = w.salaryStructure.baseSalary;
      const allow = w.salaryStructure.allowances;
      const overtime = i % 2 === 0 ? 1500 : 0;
      const ded = w.salaryStructure.deductions;
      const net = basic + allow + overtime - ded;

      await Salary.create({
        workerId: w._id,
        month: currentMonth,
        year: currentYear,
        basicSalary: basic,
        allowances: allow,
        overtime,
        deductions: ded,
        netSalary: net,
        paymentStatus: i % 2 === 0 ? 'PAID' : 'PENDING',
        paymentDate: i % 2 === 0 ? new Date() : undefined,
        notes: 'Regular monthly paystub',
      });
    }

    console.log('[Seed] Creating System Notifications...');
    for (let i = 0; i < workers.length; i++) {
      await Notification.create({
        recipientId: workers[i].userId,
        title: 'Duty Assignment Active',
        message: `You are currently stationed at ${companies[i % companies.length].name} as ${workers[i].designation}. Ensure check-in via mobile portal.`,
        type: 'ASSIGNMENT',
        isRead: i < 3,
      });
    }

    console.log('[Seed] Creating Customer Reviews...');
    await Review.create([
      {
        reviewerName: 'Principal Robert Vance',
        reviewerOrg: 'ABC International School',
        companyId: companies[0]._id,
        rating: 5,
        title: 'Outstanding Security & Discipline',
        review: 'The security guards provided for our campus are highly vigilant, courteous to students and parents, and very punctual. Highly recommended security agency!',
        serviceType: 'School Security',
        status: 'APPROVED',
      },
      {
        reviewerName: 'Sarah Jenkins',
        reviewerOrg: 'Apex Tech Park & Towers',
        companyId: companies[1]._id,
        rating: 5,
        title: 'Exceptional 24x7 Corporate Protection',
        review: 'Managing a multi-tenant tech park requires top-notch access control. Their supervisor team and CCTV operators maintain stellar standards.',
        serviceType: 'Corporate Security',
        status: 'APPROVED',
      },
      {
        reviewerName: 'Dr. Michael Chang',
        reviewerOrg: 'CityCare General Hospital',
        companyId: companies[2]._id,
        rating: 4,
        title: 'Calm & Professional Emergency Guarding',
        review: 'Emergency Room situations can escalate quickly. Their trained guards de-escalate tension calmly while keeping hospital staff safe.',
        serviceType: 'Hospital Security',
        status: 'APPROVED',
      },
    ]);

    console.log('[Seed] Creating Sample Contact Inquiries...');
    await ContactInquiry.create([
      {
        name: 'Marcus Brody',
        email: 'marcus@brodywarehouses.com',
        phone: '+1 (555) 777-1212',
        organization: 'Brody Logistics & Warehousing',
        serviceRequired: 'Warehouse Security',
        numberOfPersonnel: 6,
        message: 'Looking for 24x7 night patrol and CCTV surveillance support for our new 50,000 sq ft logistics facility.',
        status: 'NEW',
      },
      {
        name: 'Claire Underwood',
        email: 'claire@luxuryresidences.com',
        phone: '+1 (555) 444-9988',
        organization: 'Grandview Luxury Towers',
        serviceRequired: 'Residential Security',
        numberOfPersonnel: 4,
        message: 'Need uniformed security guards for residential high-rise gatekeeper and lobby reception duties.',
        status: 'CONTACTED',
      },
    ]);

    console.log('=====================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('-----------------------------------------------------');
    console.log('🔑 DEFAULT ADMIN ACCOUNT:');
    console.log('   Email: admin@securityagency.com');
    console.log('   Password: Password@123');
    console.log('   Role: ADMIN');
    console.log('-----------------------------------------------------');
    console.log('🔑 TEST WORKER ACCOUNT:');
    console.log('   Email: worker1@securityagency.com');
    console.log('   Password: Worker@123');
    console.log('   Role: WORKER');
    console.log('-----------------------------------------------------');
    console.log('🔑 TEST COMPANY ACCOUNT:');
    console.log('   Email: contact@abcschool.org');
    console.log('   Password: Company@123');
    console.log('   Role: COMPANY');
    console.log('=====================================================');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
