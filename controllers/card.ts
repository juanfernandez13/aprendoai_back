import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCardsFromCollection = async (collectionId: number) => {
  try {
    const cards = await prisma.card.findMany({ where: { collectionId: collectionId } });
    return { statusCode: 200, data: cards };
  } catch (error) {
    return { statusCode: 200, data: error };
  }
};

export const createCard = async (card: any) => {
  try {
    const cards = await prisma.card.create({
      data: {
        question: card.question,
        answer: card.answer,
        collectionId: card.collectionId,
      },
    });
    return { statusCode: 200, data: cards };
  } catch (error) {
    return { statusCode: 200, data: error };
  }
};

export const updateCard = async (card: any, cardId: number) => {
  try {
    const cards = await prisma.card.update({
      where: { id: cardId },
      data: {
        question: card.question,
        answer: card.answer,
        dateUpdate: new Date(),
      },
    });
    return { statusCode: 200, data: cards };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const deleteCard = async (cardId: number) => {
  try {
    const cards = await prisma.card.delete({
      where: { id: cardId },
    });
    return { statusCode: 204, data: cards };
  } catch (error) {
    return { statusCode: 200, data: error };
  }
};
