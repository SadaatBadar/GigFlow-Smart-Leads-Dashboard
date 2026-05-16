import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type, message: e.msg })),
    });
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const leadValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
];

export const updateLeadValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
];
