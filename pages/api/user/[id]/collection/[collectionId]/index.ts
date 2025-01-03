import { deleteCollectionById, getCollectionById, updateCollectionById } from "@/controllers/collection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { collectionId } = query;

  switch (method) {
    case "GET": {
      const { statusCode, data } = await getCollectionById(Number(collectionId));
      return res.status(statusCode).json(data);
    }
    case "PUT": {
      const { statusCode, data } = await updateCollectionById(body, Number(collectionId));
      return res.status(statusCode).json(data);
    }
    case "DELETE": {
      const { statusCode, data } = await deleteCollectionById(Number(collectionId));
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405);
  }
}
