import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createTopic = async (req, res) => {
  try {
    const folderName = "topic-pictures";

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
      use_filename: true,
    });

    const topic = await prisma.topic.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        topicPicture: result.secure_url,
      },
    });

    res.status(201).json(topic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create topic" });
  }
};
export const getAllTopics = async (req, res) => {
  try {
    const topics = await prisma.topic.findMany();
    res.status(200).json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get topics" });
  }
};


export const getTopicFollowers = async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);

    const users = await prisma.user.findMany({
      where: {
        topics: {
          some: {
            topicId: topicId,
            followed: true
          }
        }
      }
    });

    const followersCount = users.length;

    return res.status(200).json({ followersCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getTopic = async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        questions: true,
      },
    });

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    return res.status(200).json(topic);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getTopicQuestions = async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const totalQuestions = await prisma.question.count({
      where: { topicId: topicId },
    });

    const questions = await prisma.question.findMany({
      where: { topicId: topicId },
      orderBy: [
        {
          reactions: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      take: pageSize,
      skip: skip,
      include: {
        user: true,
      },
    });

    const totalPages = Math.ceil(totalQuestions / pageSize);

    return res.status(200).json({ questions, totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

