import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.post('/', protect, authorizeRoles('ADMIN'), createCompany);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateCompany);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteCompany);

export default router;
