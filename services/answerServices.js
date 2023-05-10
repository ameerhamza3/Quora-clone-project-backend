import express from "express";
const router = express.Router();
import { check, validationResult } from 'express-validator';

import { createAnswer } from "../controllers/answerController.js";
import checkAuth from "../middlewares/authentication.js";
router.post(
    '/create-answer',
    checkAuth,
  
   
    [
      check('text').notEmpty().withMessage('Text is required'),
      check('questionId').notEmpty().withMessage('Question ID is required'),
    ],
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  
    createAnswer
  );

  

export default router;
