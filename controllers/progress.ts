import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProgressUser = async (userId: number) => {
  try {
    const progress = await prisma.progress.findMany({ where: { userId: userId }, include: { progressCards: true } });
    return { statusCode: 200, data: progress };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const createProgress = async (progressData: any) => {
  try {
    let progress: any;
    await prisma.$transaction(async (prisma) => {
      const cards = await prisma.card.findMany({
        where: { collectionId: progressData.collectionId },
      });

      progress = await prisma.progress.create({
        data: {
          dateToRevision: new Date(),
          collectionId: progressData.collectionId,
          userId: progressData.userId,
        },
      });
      await prisma.progressCard.createMany({
        data: cards.map((card) => {
          return { progressId: progress.id, cardId: card.id, category: "NOTREAD" };
        }),
      });
      return { statusCode: 200, data: progress };
    });

    return { statusCode: 200, data: progress };
  } catch (error) {

    return { statusCode: 500, data: error };
  }
};

export const updateProgress = async (progressData: any, progressId: number) => {
  try {
    const progress = await prisma.progress.update({
      where: {
        id: progressId,
      },
      data: {
        dateToRevision: new Date(),
        progressCards: { connect: [] },
        dateUpdate: new Date(),
      },
    });
    return { statusCode: 200, data: progress };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const deleteProgress = async (progressId: number) => {
  try {
    const progress = await prisma.progress.delete({
      where: {
        id: progressId,
      },
    });
    return { statusCode: 200, data: progress };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const respondCards = async (answers: Array<any>, progressId: number) => {
  try {
    const data = await prisma.$transaction(
      answers.map((answer) =>
        prisma.progressCard.update({
          where: {
            progressId_cardId: {
              progressId: progressId,
              cardId: answer.cardId,
            },
          },
          data: { category: answer.category },
        })
      )
    );

    return { statusCode: 200, data };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};
