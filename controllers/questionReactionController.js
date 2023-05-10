import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const handleQuestionReaction= async (req, res)=> {
  const { userId, reactionType,questionId } = req.body;


  try {
    // Check if the user has already reacted to the question
    const existingReaction = await prisma.questionReaction.findFirst({
        where: { AND: [{ userId: Number(userId) }, { questionId: Number(questionId) }] },
      });
  
      

    if (existingReaction) {
      // User has already reacted, update the existing reaction
      await prisma.questionReaction.update({
        where: { id: existingReaction.id },
        data: { type: reactionType },
      });
    } else {
      // User has not reacted, create a new reaction
      await prisma.questionReaction.create({
        data: {
          type: reactionType,
          user: { connect: { id: Number(userId) } },
          question: { connect: { id: Number(questionId) } },
        },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Unable to save question reaction' });
  }
}



export const getQuestionReactionsForUser = async (req, res) => {
  try {
    const reaction = await prisma.questionReaction.findFirst({
      where: {
        AND: [
          { questionId: parseInt(req.body.questionId) },
          { userId: parseInt(req.body.userId) }
        ]
      }
    });
    res.send(reaction);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
}

