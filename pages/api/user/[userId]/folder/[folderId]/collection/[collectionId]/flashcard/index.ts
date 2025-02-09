import { createFlashcards, createFlashcardsWithAI, getFlashcardsFromCollection } from "@/controllers/flashcard";
import { GuardRouter } from "@/utils/guard/guardRoute";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, collectionId, generatedIA } = query;
  
  const guardResponse = await GuardRouter(req, {});
    
    if (!guardResponse.isValid) {
      const { statusCode = 0, message } = guardResponse;
      return res.status(statusCode).json({ message });
    }

  switch (method) {
    case "GET": {
      const response = await getFlashcardsFromCollection(Number(collectionId));
      return res.status(response.statusCode).json(response);
    }
    case "POST": {
      if (generatedIA) {
        const { userInput, quantity = 12 } = body;
        const response = await createFlashcardsWithAI(userInput, quantity, Number(userId), Number(collectionId));
        return res.status(response.statusCode).json(response);
      }

      const response = await createFlashcards(body, Number(userId), Number(collectionId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
