import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProgressUser = async (userId: number) => {
  try {
    const progress = await prisma.progress.findMany({ where: { userId: userId } });
    return { statusCode: 200, data: progress };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const createProgress = async (progressData: any) => {
  try {
    const progress = await prisma.progress.create({
      data: {
        dateToRevision: new Date(),
        progressCards: {connect: []},
        collectionId: progressData.collectionId,
        userId: progressData.userId,
      },
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
        progressCards: {connect: []},
        dateUpdate: new Date()
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
