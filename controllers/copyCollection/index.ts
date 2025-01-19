import { PrismaClient } from "@prisma/client";

export const copyOrUpdateCollection = async (userId: number, collectionId: number) => {
  try {
    const prisma = new PrismaClient();

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });

    if (!collection) {
      return { data: {}, statusCode: 404, error: false };
    }

    const existingCopy = await prisma.collection.findFirst({ where: { userId: userId, isCopyOf: collection.id } });
    if (existingCopy) {
      return updateCollection(collectionId, existingCopy.id);
    }

    const { nameCollection, resumeCollection } = collection;
    const collectionCreated = await prisma.collection.create({
      data: {
        userId: userId,
        nameCollection: nameCollection,
        resumeCollection: resumeCollection,
        isCopyOf: collectionId,
      },
    });

    const response = await prisma.$transaction(async (prisma) => {
      const flashcardsCollection = await prisma.collectionFlashcard.findMany({ where: { collectionId: collectionId } });

      await prisma.collectionFlashcard.createMany({
        data: flashcardsCollection.map((flashcard) => {
          return { collectionId: collectionCreated.id, flashcardId: flashcard.flashcardId };
        }),
      });

      const allDataCollection = await prisma.collection.findUnique({
        where: { id: collectionCreated.id },
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

const updateCollection = async (collectionId: number, collectionCopiedId: number) => {
  const prisma = new PrismaClient();

  const allCollectionFlashcards = await prisma.collectionFlashcard.findMany({ where: { collectionId: collectionId } });
  const collectionFlashcards = await prisma.collectionFlashcard.findMany({
    where: { collectionId: collectionCopiedId },
  });

  const flashcardsId = allCollectionFlashcards.map((collectionFlashcard) => collectionFlashcard.flashcardId);
  const flashcardsId2 = collectionFlashcards.map( (collectionFlashcard) => collectionFlashcard.flashcardId);
  
  if (flashcardsId.length === flashcardsId2.length){
    return {statusCode: 200, message: 'coleção já atualizada', error: false}
  }

  const flashcardsToCreate = flashcardsId.filter((value) => !flashcardsId2.includes(value))

  await prisma.collectionFlashcard.createMany({
    data: flashcardsToCreate.map((flashcardId) => {return { collectionId: collectionCopiedId, flashcardId:flashcardId};})
  });

  
  return { statusCode: 200, message: "coleção atualizada", error: false };
};
