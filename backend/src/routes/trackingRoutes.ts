import { Router } from 'express';
import { trackVisitorAlert } from '../controllers/trackingController';

const router = Router();

router.post('/visitor', trackVisitorAlert);
router.post('/track', trackVisitorAlert);

export default router;
