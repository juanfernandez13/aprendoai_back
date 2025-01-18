import { createCollection, getCollectionsByUserId } from "@/controllers/collection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, quantity = 12, page = 1 } = query;

  switch (method) {
    case "GET": {
      const response = await getCollectionsByUserId(Number(userId), Number(quantity), Number(page));
      return res.status(response.statusCode).json(response);
    }
    case "POST": {
      const collectionData = { ...body, userId: Number(userId) };
      const response = await createCollection(collectionData);
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
