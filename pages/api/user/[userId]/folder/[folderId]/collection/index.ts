import { getCollectionsByFolderId, createCollection } from "@/controllers/collection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, folderId, quantity = 12, page = 1 } = query;

  switch (method) {
    case "GET": {
      // Passando o folderId e a paginação diretamente para a função
      const response = await getCollectionsByFolderId(Number(folderId), Number(quantity), Number(page));

      return res.status(response.statusCode).json(response);
    }

    case "POST": {
      const collectionData = { 
        ...body, 
        userId: Number(userId), 
        folderId: Number(folderId)
      };

      const response = await createCollection(collectionData);

      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
