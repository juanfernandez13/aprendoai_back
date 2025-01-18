import { deleteProgress, respondCards, updateProgress } from "@/controllers/progress";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { progressId } = query;

  switch (method) {
    
    case "POST": {
      const { statusCode, data } = await respondCards(body.answers, Number(progressId));
      return res.status(statusCode).json(data);
    }
    case "PUT": {
      const { statusCode, data } = await updateProgress(body, Number(progressId));
      return res.status(statusCode).json(data);
    }
    case "DELETE": {
      const { statusCode, data } = await deleteProgress(Number(progressId));
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405);
  }
}
