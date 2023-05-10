import express from "express";

import checkAuth from "../middlewares/authentication.js";

const router = express.Router();
import { handleQuestionReaction, getQuestionReactionsForUser} from "../controllers/questionReactionController.js";

router.post("/", checkAuth, handleQuestionReaction);
router.get("/get-question-reactions", checkAuth, getQuestionReactionsForUser);
export default router;
