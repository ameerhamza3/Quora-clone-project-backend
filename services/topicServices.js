import express from "express";
import multer from "multer";
import { check, validationResult } from "express-validator";

import checkAuth from "../middlewares/authentication.js";
import {
  createTopic,
  getTopicFollowers,
  getAllTopics,
  getTopicQuestions,
  getTopic,
} from "../controllers/topicController.js";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 1024 * 1024 * 5 },
});

router.post(
  "/",
  checkAuth,
  upload.single("topicPicture"),
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 500 })
      .withMessage("Description can be up to 500 characters only"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createTopic
);
router.get("/:topicId/followers", getTopicFollowers);
// GET /topics/:topicId/questions?page=:page
router.get("/:topicId/questions", getTopicQuestions);

router.get("/get-all-topics", checkAuth, getAllTopics);
router.get("/:topicId", getTopic);

export default router;
