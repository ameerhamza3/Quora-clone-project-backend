import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createQuestion = async (req, res) => {
  try {
    const { topicId } = req.body;
    const { title, description } = req.body;

    const topic = await prisma.topic.findUnique({
      where: { id: parseInt(topicId) },
    });
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const question = await prisma.question.create({
      data: {
        title,
        description,
        user: { connect: { id: parseInt(req.body.userId) } },
        topic: { connect: { id: parseInt(topicId) } },
      },
      include: {
        user: true,
      },
    });

    return res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create question" });
  }
};




export const getTopicQuestions = async (req, res) => {
  try {
    const userId = req.query.userId;

    // Fetch all the topics that the user is following
    const userTopics = await prisma.userTopic.findMany({
      where: { userId: parseInt(userId), followed: true },
      select: { topicId: true },
    });
    const topicIds = userTopics.map((userTopic) => userTopic.topicId);

    // Fetch all the questions related to those topics, along with the User data of the person who asked each question
    const questions = await prisma.question.findMany({
      where: { topicId: { in: topicIds } },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            age: true,
            gender: true,
            profilePicture: true,
          },
        },
      },
    });

    res.status(200).json({
      questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get topic questions" });
  }
};


export const getQuestionAnswers = async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        user: true,
      },
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const topTwoAnswers = await prisma.answer.findMany({
      where: { questionId: questionId },
      include: {
        user: true,
        question: true,
        reactions: true,
      },
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
      take: 2,
    });

    const remainingAnswers = await prisma.answer.findMany({
      where: { 
        questionId: questionId, 
        NOT: {
          id: {
            in: topTwoAnswers.map(a => a.id)
          }
        }
      },
      include: {
        user: true,
        question: true,
        reactions: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const answers = topTwoAnswers.concat(remainingAnswers);

    return res.status(200).json({ question, answers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getQuestionsWithAnswersByUserId = async (req, res) => {
  const userId = parseInt(req.query.userId);
  try {
    const questions = await prisma.question.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
          },
        },
      },
    });
    return res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserAnsweredQuestions = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    const userAnswers = await prisma.answer.findMany({
      where: { userId: userId },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                age: true,
                gender: true,
                profilePicture: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const questions = userAnswers.map((answer) => {
      const { question, ...answerData } = answer;
      return {
        ...question,
        answers: [answerData],
      };
    });

    return res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const searchQuestionsByTopic = async (req, res) => {
  const { query } = req.query;

  try {
    const questions = await prisma.question.findMany({
      where: {
        topic: {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      include: {
        user: true,
        topic: true,
      },
    });

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

