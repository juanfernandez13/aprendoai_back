import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

export const getFlashcardsFromCollection = async (collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const collectionsFlashcards = await prisma.collectionFlashcard.findMany({
      where: {
        collectionId: collectionId,
      },
    });
    const flashcards = await Promise.all(
      collectionsFlashcards.map(async (collectionsFlashcard) => {
        const flashcard = await prisma.flashcard.findUnique({
          where: { id: collectionsFlashcard.flashcardId },
          include: { collectionFlashcard: { where: { collectionId: collectionId } } },
        });
        return flashcard;
      })
    );

    const response = { data: flashcards, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
export const getFlashcardById = async (flashcardId: number, collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      include: { collectionFlashcard: { where: { collectionId: collectionId } } },
    });

    const response = { data: flashcard, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const createFlashcards = async (
  flashcardsData: any,
  userId: number,
  collectionId: number,
  generatedIA?: boolean
) => {
  try {
    const prisma = new PrismaClient();
    const response = await prisma.$transaction(async (prisma) => {
      const flashcards = await Promise.all(
        flashcardsData.flashcards.map(async (flashcard: any) => {
          const flashcardCreated = await prisma.flashcard.create({
            data: {
              userId: userId,
              question: flashcard.question,
              options: flashcard.options, // Certifique-se de que isso é um array de strings
              correctAnswer: flashcard.correctAnswer,
              isGerenatedAI: generatedIA ?? false,
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
    return { message: error, statusCode: 500, error: true };
  }
};


export const updateFlashcard = async (flashcardsData: any, flashcardId: number, userId: number) => {
  try {
    const prisma = new PrismaClient();

    const flashcardUpdated = await prisma.flashcard.update({
      where: { id: flashcardId, userId: userId },
      data: {
        question: flashcardsData.question,
      //  answer: flashcardsData.answer,
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


export const createFlashcardsWithAI = async (summaryInput: string, quantity: number, userId: number, collectionId: number) => {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyA8wd6JmHymHBQKPQ3hib74azbBFi5372M");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um assistente de criação de flashcards. Gere ${quantity} flashcards no formato:
      {
        "question": "Texto da questão",
        "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
        "correctAnswer": "Resposta correta"
      }
      O conteúdo é: ${summaryInput}
      Apenas retorne a lista JSON sem texto adicional.
    `;

    const result = await model.generateContent(prompt);
    const data = result.response.text();

    const stringJson = data.replace(/```json/g, "").replace(/```/g, "").trim();
    const IAFlashcards = { flashcards: JSON.parse(stringJson) };

    const response = await createFlashcards(IAFlashcards, userId, collectionId, true);
    return response;
  } catch (error) {
    return { error: true, statusCode: 500, data: error };
  }
};
