import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const followTopic = async (req, res) => {
  try {
    const { userId, topicId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    const topic = await prisma.topic.findUnique({
      where: { id: parseInt(topicId) },
    });

    if (!user || !topic) {
      return res.status(404).json({ error: "User or topic not found" });
    }

    const existingFollow = await prisma.userTopic.findFirst({
      where: {
        AND: [{ userId: parseInt(userId) }, { topicId: parseInt(topicId) }],
      },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ error: "User is already following this topic" });
    }

    const userTopic = await prisma.userTopic.create({
      data: {
        user: { connect: { id: parseInt(userId) } },
        topic: { connect: { id: parseInt(topicId) } },
        followed: true, 
      },
    });

    res.status(201).json(userTopic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to follow topic" });
  }
};

export const getTopicFollowers = async (req, res) => {
  try {
    const { topicId } = req.body;

    const count = await prisma.userTopic.count({
      where: { topicId: parseInt(topicId) },
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get topic followers" });
  }
};
export const getFollowedTopicsByUserId = async (req, res) => {
  try {
 

    const followedTopics = await prisma.userTopic.findMany({
      where: { 
        userId: parseInt(req.query.userId),
        followed: true,
      },
      include: {
        topic: true,
      },
    });

    res.json(followedTopics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get followed topics" });
  }
};
