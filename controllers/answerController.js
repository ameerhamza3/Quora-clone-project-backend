import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAnswer = async (req, res) => {
  try {
    const { text, userId, questionId } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
    });

    if (!user || !question) {
      return res
        .status(404)
        .json({ error: "User, topic, or question not found" });
    }

    const answer = await prisma.answer.create({
      data: {
        text,
        user: { connect: { id: parseInt(userId) } },
        question: { connect: { id: parseInt(questionId) } },
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create answer" });
  }
};
