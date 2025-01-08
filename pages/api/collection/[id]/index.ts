import { associateUserCollection, searchCollection } from "@/controllers/collection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;
  const { id } = query;

  switch (method) {
    case "POST":
      const response = await associateUserCollection({...body, collectionId: Number(id)})
      return res.status(response.statusCode).json(response);
    default:
      return res.status(409).json({ error: "Method not allowed" });
  }
}
