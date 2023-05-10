import express from 'express';
import { check, validationResult } from 'express-validator';
import {
  createQuestion,
  getQuestionAnswers,
  getTopicQuestions,
  getQuestionsWithAnswersByUserId,
  getUserAnsweredQuestions,
  searchQuestionsByTopic
} from '../controllers/questionController.js';
import checkAuth from '../middlewares/authentication.js';

const router = express.Router();

router.post(
  '/create-question',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('topicId').notEmpty().withMessage('TopicId is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createQuestion
);

router.get(
  '/get-topic-questions',
  checkAuth,
  [
    check('userId').notEmpty().withMessage('Topic ID is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getTopicQuestions
);

router.get(
  '/get-question-answers/:questionId',
  checkAuth,
  (req, res, next) => {
    const questionId = req.params.questionId;
    if (!questionId) {
      return res.status(400).json({ errors: [{ msg: 'Question ID is required' }] });
    }
    next();
  },
  getQuestionAnswers
);

router.get(
  '/get-user-questions-with-answers',
  checkAuth,
  [
    check('userId').notEmpty().withMessage('User ID is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getQuestionsWithAnswersByUserId
);

router.get(
  '/get-user-answered-questions',
  checkAuth,
  [
    check('userId').notEmpty().withMessage('User ID is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getUserAnsweredQuestions
);
router.get('/search-questions-by-topic', checkAuth, searchQuestionsByTopic);

export default router;
