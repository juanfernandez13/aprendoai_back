import { GoogleGenerativeAI } from "@google/generative-ai";
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

export const createCard = async (card: any, collectionId: number, creatorId: number, isGeneratedAI?: boolean) => {
  try {
    let cards: any;
    const data = await prisma.$transaction(async (prisma) => {
      const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
      if (collection?.creatorId != creatorId) {
        return { statusCode: 403, data: "Você não pode editar" };
      }

      const cardCreated = await prisma.card.create({
        data: {
          question: card.question,
          answer: card.answer,
          collectionId: collectionId,
          isGeneratedAI: isGeneratedAI
        },
      });
      cards = cardCreated;
      const progresses = await prisma.progress.findMany({ where: { collectionId: collectionId } });
      await prisma.progressCard.createMany({
        data: progresses.map((progress) => {
          return { cardId: cardCreated.id, progressId: progress.id };
        }),
      });
    });
    return data || { statusCode: 200, data: "" };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const updateCard = async (card: any, cardId: number, creatorId: number) => {
  try {
    const cards = await prisma.card.update({
      where: {
        id: cardId,
        collection: {
          creatorId: creatorId,
        },
      },
      data: {
        question: card.question,
        answer: card.answer,
        dateUpdate: new Date(),
      },
    });
    return { statusCode: 200, data: cards };
  } catch (error: any) {
    if (error.meta.cause === "Record to update not found.") {
      return { statusCode: 404, data: "Not found" };
    }
    return { statusCode: 500, data: error };
  }
};

export const deleteCard = async (cardId: number, creatorId: number) => {
  try {
    let cards;
    await prisma.$transaction(async (prisma) => {
      const cardDeleted = await prisma.card.delete({
        where: {
          id: cardId,
          collection: {
            creatorId: creatorId,
          },
        },
      });
      cards = cardDeleted;
      await prisma.progressCard.deleteMany({ where: { cardId: cardId } });
    });
    return { statusCode: 204, data: cards };
  } catch (error: any) {
    if (error.meta.cause === "Record to delete does not exist.") {
      return { statusCode: 404, data: "Not found" };
    }
    return { statusCode: 200, data: error };
  }
};

type status = "NOTREAD" | "BAD" | "MEDIUM" | "GOOD";

export const genereteCards = async (userInput: string, quantity: number, collectionId:number, creatorId:number) => {
  const genAI = new GoogleGenerativeAI("AIzaSyBUD1H9CI8PBz2AVV7CZ97aiLAQimpYoh4");
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

  const IAcards = JSON.parse(stringJson);

  IAcards.map((card:any) => createCard(card, collectionId, creatorId, true))

  return { statusCode: 200, data: IAcards };
};
