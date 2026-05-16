import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
  getStats,
} from '../controllers/leadController';
import { protect, restrictTo } from '../middleware/auth';
import { leadValidation, updateLeadValidation, validate } from '../middleware/validation';

const router = Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/export', restrictTo('admin'), exportLeads);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', leadValidation, validate, createLead);
router.put('/:id', updateLeadValidation, validate, updateLead);
router.delete('/:id', restrictTo('admin'), deleteLead);

export default router;
