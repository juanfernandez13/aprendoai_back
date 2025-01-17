import { deleteCard, updateCard } from "@/controllers/card";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { cardId, id } = query;

  switch (method) {
    case "PUT": {
      const { statusCode, data } = await updateCard(body, Number(cardId), Number(id));
      return res.status(statusCode).json(data);
    }
    case "DELETE": {
      const { statusCode, data } = await deleteCard(Number(cardId), Number(id));
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405);
  }
}
