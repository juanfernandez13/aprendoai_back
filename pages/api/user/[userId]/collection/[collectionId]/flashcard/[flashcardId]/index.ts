import { deleteFlashcard, getFlashcardById, updateFlashcard } from "@/controllers/flashcard";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, flashcardId } = query;

  switch (method) {
    case "GET": {
      const response = await getFlashcardById(Number(flashcardId));
      return res.status(response.statusCode).json(response);
    }
    case "PUT": {
      const flashcardData = { ...body };
      const response = await updateFlashcard(flashcardData, Number(flashcardId), Number(userId));
      return res.status(response.statusCode).json(response);
    }
    case "DELETE": {
      const response = await deleteFlashcard(Number(flashcardId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
