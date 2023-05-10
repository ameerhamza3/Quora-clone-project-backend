

import express from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import { register, login } from '../controllers/authController.js';

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 1024 * 1024 * 5 },
});

// Validation middleware for the register route
router.post(
  '/register',
 
  upload.single('profilePicture'),
  register
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Email is not valid'),
    check('password').notEmpty().withMessage('Password is required'),
   
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

export default router;
