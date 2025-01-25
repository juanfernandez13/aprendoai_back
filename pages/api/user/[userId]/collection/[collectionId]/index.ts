import { deleteCollectionById, getCollectionsById, updateCollectionById } from "@/controllers/collection";
import { GuardRouter } from "@/utils/guard/guardRoute";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, collectionId } = query;

  const guardResponse = await GuardRouter(req, { userId: Number(userId) });
    
    if (!guardResponse.isValid) {
      const { statusCode = 0, message } = guardResponse;
      return res.status(statusCode).json({ message });
    }

  switch (method) {
    case "GET": {
      const response = await getCollectionsById(Number(collectionId));
      return res.status(response.statusCode).json(response);
    }
    case "PUT": {
      const collectionData = { ...body };
      const response = await updateCollectionById(collectionData, Number(collectionId));
      return res.status(response.statusCode).json(response);
    }
    case "DELETE": {
      const response = await deleteCollectionById(Number(collectionId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
