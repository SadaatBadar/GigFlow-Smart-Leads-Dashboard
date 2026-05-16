import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  validate,
} from '../middleware/validation';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);

export default router;
