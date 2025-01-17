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

export const createCard = async (card: any) => {
  try {
    let cards: any;

    const data = await prisma.$transaction(async (prisma) => {
      const collection = await prisma.collection.findUnique({ where: { id: card.collectionId } });
      if (collection?.creatorId != card.creatorId) {
        return { statusCode: 403, data: "Você não pode editar" };
      }

      const cardCreated = await prisma.card.create({
        data: {
          question: card.question,
          answer: card.answer,
          collectionId: card.collectionId,
        },
      });
      cards = cardCreated;
      const progresses = await prisma.progress.findMany({ where: { collectionId: card.collectionId } });
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

export const genereteCards = async (userInput: string) => {
  const genAI = new GoogleGenerativeAI("é mole");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Você é um modelo de IA especializado em gerar flashcards para estudo. 
**INSTRUÇÕES IMPORTANTES**: 
1. Sua resposta deve conter uma lista JSON de objetos.
2. O formato de cada objeto deve ser exatamente o seguinte: 
   {"question": "Texto da pergunta", "answer": "Texto da resposta"}.
3. NÃO inclua informações adicionais como "json", "aqui está sua resposta" ou qualquer outro texto.
4. Retorne exatamente 12 flashcards com base no tema fornecido.

TEMA FORNECIDO: ${userInput.trim()}
`;

  const result = await model.generateContent(prompt);
  const data = result.response.text();

  const stringJson = data
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const obj = JSON.parse(stringJson);
  console.log(obj);
  return { statusCode: 200, data: stringJson };
};
