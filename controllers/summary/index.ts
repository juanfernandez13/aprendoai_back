import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

export const getSummariesFromCollection = async (collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const collectionSummaries = await prisma.collectionSummary.findMany({
      where: { collectionId },
      include: { summary: true }
    });

    return { 
      data: collectionSummaries.map((cs) => cs.summary), 
      statusCode: 200, 
      error: false 
    };
  } catch (error) {
    console.error(error);
    return { message: String(error), statusCode: 500, error: true };
  }
};


export const createSummary = async (
  content: string,
  userId: number,
  collectionId: number,
  isGeneratedAI: boolean = false
) => {
  try {
    const prisma = new PrismaClient();
    
    const result = await prisma.$transaction(async (prisma) => {
      const summary = await prisma.summary.create({
        data: {
          userId,
          content,
          isGeneratedAI
        }
      });

      await prisma.collectionSummary.create({
        data: {
          collectionId,
          summaryId: summary.id
        }
      });

      return summary;
    });

    return { data: result, statusCode: 201, error: false };
  } catch (error) {
    return { message: error, statusCode: 500, error: true };
  }
};

export const createSummaryWithAI = async (
  subjectName: string,
  userId: number,
  collectionId: number
) => {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyA8wd6JmHymHBQKPQ3hib74azbBFi5372M");//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA p i?
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um assistente de resumos acadêmicos. 
      Gere um resumo conciso e bem estruturado sobre: ${subjectName}
      *FORMATO DE SAÍDA DEVE SER APENAS UM OBJETO JSON COM A CHAVE "content"*
      NÃO INCLUA MARKDOWN OU TEXTO EXTRA.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonContent = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());

    return await createSummary(jsonContent.content, userId, collectionId, true);
  } catch (error) {
    return { error: true, statusCode: 500, data: error };
  }
};

export const updateSummary = async (summaryId: number, content: string, userId: number) => {
  try {
    const prisma = new PrismaClient();
    const updated = await prisma.summary.update({
      where: { id: summaryId, userId },
      data: { content, dateUpdate: new Date() }
    });
    return { data: updated, statusCode: 200, error: false };
  } catch (error) {
    return { message: error, statusCode: 500, error: true };
  }
};

export const deleteSummary = async (summaryId: number) => {
  try {
    const prisma = new PrismaClient();
    await prisma.$transaction([
      prisma.collectionSummary.deleteMany({ where: { summaryId } }),
      prisma.summary.delete({ where: { id: summaryId } })
    ]);
    return { data: true, statusCode: 200, error: false };
  } catch (error) {
    return { message: error, statusCode: 500, error: true };
  }
};