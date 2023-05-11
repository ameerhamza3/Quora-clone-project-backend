import express from "express";
import path from "path";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";

import authRoutes from "./services/authServices.js";
import profileRoutes from "./services/profileServices.js";
import topicRoutes from "./services/topicServices.js";
import followTopicRoutes from "./services/followTopicServices.js";
import questionRoutes from "./services/questionServices.js";
import answerRoutes from "./services/answerServices.js";
import questionReactionRoutes from './services/questionReactionService.js'
import answerReactionRoutes from './services/answerReactionService.js'
const app = express();
const prisma = new PrismaClient();


app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(import.meta.url, "public")));


app.use("/users/auth", authRoutes);
app.use("/users/profile", profileRoutes);
app.use("/users/topic", topicRoutes);
app.use("/users/follow", followTopicRoutes);
app.use("/users/question", questionRoutes);
app.use("/users/answer", answerRoutes);
app.use("/users/question-reaction", questionReactionRoutes);
app.use("/users/answer-reaction", answerReactionRoutes);

prisma
  .$connect()
  .then(() => console.log("Connected to Postgres with Prisma..."))
  .catch((error) => console.log(error.message));

export default app;
