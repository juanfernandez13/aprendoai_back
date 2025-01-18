import { getCollectionsByParams } from "@/controllers/collection";
import { copyCollection } from "@/controllers/copyCollection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  const { textSearch = "", quantity = "12", page = "1" } = query;

  switch (method) {
    case "GET": {
      const response = await getCollectionsByParams(textSearch.toString(), Number(quantity), Number(page));
      return res.status(response.statusCode).json(response);
    }
    case "POST": {
      const { userId, collectionId } = body;
      const response = await copyCollection(Number(userId), Number(collectionId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
