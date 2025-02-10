import { deleteSummary, updateSummary } from "@/controllers/summary";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, collectionId, summaryId } = query;

  switch (method) {
    case "PUT": {
      const response = await updateSummary(Number(summaryId), body.content, Number(userId));
      return res.status(response.statusCode).json(response);
    }
    case "DELETE": {
      const response = await deleteSummary(Number(summaryId));
      return res.status(response.statusCode).json(response);
    }
    default:
      return res.status(405).json({ message: "Method not allowed", error: true, statusCode: 405 });
  }
}