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
              answer: flashcard.answer,
              isGerenatedAI: generatedIA,
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


export const createFlashcardsWithAI = async (userInput: string, quantity: number, userId:number, collectionId:number) => {
  try {
    const genAI = new GoogleGenerativeAI("api KEY");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
"Você é um agente em um aplicativo de criação de flash cards. 
*SUA RESPOSTA SEMPRE DEVE RETORNAR NO FORMATO LISTA COM OBJETOS NO FORMATO {\"question\": generete question, \"answer\": generete answer}*. 
DEVOLVA SOMENTE NO FORMATO FORNECIDO E NADA ALÉM DISSO, OU SEJA NÃO INCLUA "json" OU "aqui está sua resposta" OU OUTRAS COISAS DESSA NATUREZA.
Você deve gerar ${quantity} flashcards sobre o assunto que o usuário quiser. 
O usuário digitou isso: ${userInput}
`;
    const result = await model.generateContent(prompt);
    const data = result.response.text();

    const stringJson = data
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const IAFlashcards = { flashcards: JSON.parse(stringJson) };

    const response = await createFlashcards(IAFlashcards, userId, collectionId, true);

    return response;
  } catch (error) {
    return {error: true, statusCode: 500, data: error}
  }
};