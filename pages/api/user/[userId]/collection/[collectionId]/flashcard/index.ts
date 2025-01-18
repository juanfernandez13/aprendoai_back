import { createFlashcards, getFlashcardsFromCollection } from "@/controllers/flashcard";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, collectionId } = query;

  switch (method) {
    case "GET": {
      const response = await getFlashcardsFromCollection(Number(collectionId));
      return res.status(response.statusCode).json(response);
    }
    case "POST": {
      const flashcardData = { ...body, userId: Number(userId) };
      const response = await createFlashcards(flashcardData, Number(collectionId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
