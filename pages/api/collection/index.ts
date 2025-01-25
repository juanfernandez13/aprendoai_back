import { getCollectionsByParams } from "@/controllers/collection";
import { copyOrUpdateCollection } from "@/controllers/copyCollection";
import { GuardRouter } from "@/utils/guard/guardRoute";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  const { textSearch = "", quantity = "12", page = "1" } = query;

  const guardResponse = await GuardRouter(req, {});

  if (!guardResponse.isValid) {
    const { statusCode = 0, message } = guardResponse;
    return res.status(statusCode).json({ message });
  }

  switch (method) {
    case "GET": {
      const response = await getCollectionsByParams(textSearch.toString(), Number(quantity), Number(page));
      return res.status(response.statusCode).json(response);
    }
    case "POST": {
      const { userId, collectionId, userCopying } = body;
      const response = await copyOrUpdateCollection(Number(userId), Number(collectionId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
