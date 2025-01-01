import { createCard, getAllCardsFromCollection } from "@/controllers/card";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { collectionId } = query;
  switch (method) {
    case "GET": {
      const { statusCode, data } = await getAllCardsFromCollection(Number(collectionId));
      return res.status(statusCode).json(data);
    }
    case "POST": {
      const { statusCode, data } = await createCard({ ...body, collectionId: Number(collectionId) });
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405).send("");
  }
}
