import { Request, Response } from 'express';
import ContactInquiry from '../models/ContactInquiry';

// @desc    Submit Contact/Security Request Inquiry (Public)
// @route   POST /api/contact
export const submitInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, organization, serviceRequired, numberOfPersonnel, message } = req.body;

    if (!name || !email || !phone || !message) {
      res.status(400).json({ message: 'Name, email, phone, and message are required.' });
      return;
    }

    const inquiry = await ContactInquiry.create({
      name,
      email: email.toLowerCase(),
      phone,
      organization,
      serviceRequired: serviceRequired || 'Corporate Security',
      numberOfPersonnel: Number(numberOfPersonnel) || 1,
      message,
      status: 'NEW',
    });

    res.status(201).json({
      message: 'Inquiry received successfully! Our security manager will contact you within 2 hours.',
      inquiry,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error submitting inquiry.' });
  }
};

// @desc    Get all Contact Inquiries (Admin)
// @route   GET /api/contact
export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const inquiries = await ContactInquiry.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ count: inquiries.length, inquiries });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching inquiries.' });
  }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/contact/:id
export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;

    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found.' });
      return;
    }

    if (status) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;

    await inquiry.save();

    res.status(200).json({ message: 'Inquiry status updated.', inquiry });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating inquiry.' });
  }
};
