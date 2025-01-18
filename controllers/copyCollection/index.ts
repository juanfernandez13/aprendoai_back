import { PrismaClient } from "@prisma/client";

export const copyCollection = async (userId: number, collectionId: number) => {
  try {
    const prisma = new PrismaClient();

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) return { data: {}, statusCode: 404, error: false };
    const { nameCollection, resumeCollection } = collection;

    const collectionCreated = await prisma.collection.create({
      data: { userId: userId, nameCollection: nameCollection, resumeCollection: resumeCollection },
    });

    const response = await prisma.$transaction(async (prisma) => {
      const flashcardsCollection = await prisma.collectionFlashcard.findMany({ where: { collectionId: collectionId } });

      await prisma.collectionFlashcard.createMany({
        data: flashcardsCollection.map((flashcard) => {
          return { collectionId: collectionCreated.id, flashcardId: flashcard.flashcardId };
        }),
      });

      const allDataCollection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: { collectionFlashcard: true },
      });
      return { data: allDataCollection, statusCode: 200, error: false };
    });

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
