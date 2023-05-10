import express from "express";
import { check, validationResult } from "express-validator";
import checkAuth from "../middlewares/authentication.js";
import {
  getUserById,
  editUserprofile,
} from "../controllers/profileController.js";

const router = express.Router();

router.patch(
  "/:userId",
  checkAuth,
 
  editUserprofile
);

router.get("/", checkAuth, getUserById);

export default router;
