import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const handleAnswerReaction = async (req, res) => {
  const { userId, answerId,reactionType } = req.body;
 

  try {
    const existingReaction = await prisma.answerReaction.findFirst({
      where: { AND: [{ userId: Number(userId) }, { answerId: Number(answerId) }] },
    });

    if (existingReaction) {
      // User has already reacted, update the existing reaction
      await prisma.answerReaction.update({
        where: { id: existingReaction.id },
        data: { type: reactionType },
      });
    } else {
      // User has not reacted, create a new reaction
      await prisma.answerReaction.create({
        data: {
          type: reactionType,
          user: { connect: { id: Number(userId) } },
          answer: { connect: { id: Number(answerId) } },
        },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Unable to save answer reaction' });
  }
};
