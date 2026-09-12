import { Response } from 'express';
import Notification from '../models/Notification';
import User from '../models/User';
import Worker from '../models/Worker';
import { AuthRequest } from '../types';

// @desc    Get user notifications
// @route   GET /api/notifications
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ recipientId: req.user.id, isRead: false });

    res.status(200).json({ count: notifications.length, unreadCount, notifications });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching notifications.' });
  }
};

// @desc    Create notification (Admin)
// @route   POST /api/notifications
export const createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipientId, workerId, title, message, type, isBroadcast } = req.body;

    if (!title || !message) {
      res.status(400).json({ message: 'Title and message are required.' });
      return;
    }

    if (isBroadcast) {
      // Send to all workers
      const workers = await Worker.find().select('userId');
      const notifications = workers.map((w) => ({
        recipientId: w.userId,
        title,
        message,
        type: type || 'ANNOUNCEMENT',
      }));

      await Notification.insertMany(notifications);
      res.status(201).json({ message: `Broadcast notification sent to ${workers.length} workers.` });
      return;
    }

    let targetUserId = recipientId;
    if (!targetUserId && workerId) {
      const worker = await Worker.findById(workerId);
      if (worker) targetUserId = worker.userId;
    }

    if (!targetUserId) {
      res.status(400).json({ message: 'Recipient is required.' });
      return;
    }

    const notification = await Notification.create({
      recipientId: targetUserId,
      title,
      message,
      type: type || 'ANNOUNCEMENT',
    });

    res.status(201).json({ message: 'Notification sent successfully.', notification });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating notification.' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404).json({ message: 'Notification not found.' });
      return;
    }

    if (notification.recipientId.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Unauthorized to modify this notification.' });
      return;
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read.', notification });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating notification.' });
  }
};
