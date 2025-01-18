import { PrismaClient } from "@prisma/client";

export const getFlashcardsFromCollection = async (collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const collectionsFlashcards = await prisma.collectionFlashcard.findMany({
      where: {
        collectionId: collectionId,
      },
    });
    const flashcards = await Promise.all(collectionsFlashcards.map(async (collectionsFlashcard) => {
      const flashcard = await prisma.flashcard.findUnique({ where: { id: collectionsFlashcard.flashcardId },include:{collectionFlashcard: {where: {collectionId:collectionId}}} });
      return flashcard;
    }))

    const response = { data: flashcards, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
export const getFlashcardById = async (flashcardId: number) => {
  try {
    const prisma = new PrismaClient();
    const flashcard = await prisma.flashcard.findUnique({
      where: {
        id: flashcardId,
      },
    });

    const response = { data: flashcard, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const createFlashcards = async (flashcardsData: any, collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const response = await prisma.$transaction(async (prisma) => {
      const flashcards = await Promise.all(
        flashcardsData.flashcards.map(async (flashcard: any) => {
          const flashcardCreated = await prisma.flashcard.create({
            data: {
              userId: flashcardsData.userId,
              question: flashcard.question,
              answer: flashcard.answer,
            },
          });
          const collectionflashcard = await prisma.collectionFlashcard.create({
            data: { collectionId: collectionId, flashcardId: flashcardCreated.id },
          });

          return { flashcard: flashcardCreated, collectionFlashcard: collectionflashcard };
        })
      );

      return { data: { flashcards: flashcards }, statusCode: 200, error: false };
    });

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const updateFlashcard = async (flashcardsData: any, flashcardId: number, userId: number) => {
  try {
    const prisma = new PrismaClient();

    const flashcardUpdated = await prisma.flashcard.update({
      where: { id: flashcardId, userId: userId },
      data: {
        question: flashcardsData.question,
        answer: flashcardsData.answer,
        dateUpdate: new Date(),
      },
    });

    const response = { data: flashcardUpdated, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const replyFlashcard = async (flashcardsData: any, collectionId: number, flashcardId: number) => {
  try {
    const prisma = new PrismaClient();
    console.log(new Date());
    const flashcardUpdated = await prisma.collectionFlashcard.update({
      where: {
        collectionId_flashcardId: {
          collectionId: collectionId,
          flashcardId: flashcardId,
        },
      },
      data: {
        status: flashcardsData.status,
        dateRevision: new Date(),
        dateUpdate: new Date(),
      },
    });

    const response = { data: flashcardUpdated, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const deleteFlashcard = async (flashcardId: number) => {
  try {
    const prisma = new PrismaClient();

    const flashcarDeleted = await prisma.flashcard.delete({
      where: { id: flashcardId },
    });

    const response = { data: flashcarDeleted, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
