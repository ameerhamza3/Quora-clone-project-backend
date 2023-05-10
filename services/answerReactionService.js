import express from "express";

import checkAuth from "../middlewares/authentication.js";

const router = express.Router();
import { handleAnswerReaction } from "../controllers/answerReactionController.js";

router.post("/", checkAuth, handleAnswerReaction);

export default router;
