import express from 'express';
import { check, validationResult } from 'express-validator';
import {
  followTopic,
  getFollowedTopicsByUserId,
  getTopicFollowers,
} from '../controllers/followTopicController.js';

const router = express.Router();


router.post(
  '/follow-topic',
  [
    check('userId').notEmpty().withMessage('User ID is required'),
    check('topicId').notEmpty().withMessage('Topic ID is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  followTopic
);

router.get('/followers', getTopicFollowers);
router.get('/followed-topics', getFollowedTopicsByUserId);

export default router;
