import { deleteFlashcard, getFlashcardById, replyFlashcard, updateFlashcard } from "@/controllers/flashcard";
import { GuardRouter } from "@/utils/guard/guardRoute";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, collectionId, flashcardId } = query;

  const guardResponse = await GuardRouter(req, {});

  if (!guardResponse.isValid) {
    const { statusCode = 0, message } = guardResponse;
    return res.status(statusCode).json({ message });
  }

  switch (method) {
    case "GET": {
      const response = await getFlashcardById(Number(flashcardId), Number(collectionId));
      return res.status(response.statusCode).json(response);
    }
    case "POST": {
      const response = await replyFlashcard(body, Number(collectionId), Number(flashcardId));
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
