import { createCollection, getCollectionsByUserId } from "@/controllers/collection";
import { GuardRouter } from "@/utils/guard/guardRoute";
import { verifyToken } from "@/utils/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, quantity = 12, page = 1 } = query;

  const guardResponse = await GuardRouter(req, { userId: Number(userId) });
  
  if (!guardResponse.isValid) {
    const { statusCode = 0, message } = guardResponse;
    return res.status(statusCode).json({ message });
  }

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
