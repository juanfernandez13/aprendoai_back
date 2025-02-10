import { 
    createSummary, 
    createSummaryWithAI, 
    getSummariesFromCollection 
  } from "@/controllers/summary";
  import type { NextApiRequest, NextApiResponse } from "next";
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body, query } = req;
    const { userId, collectionId, generatedIA } = query;
  
    switch (method) {
      case "GET": {
        const response = await getSummariesFromCollection(Number(collectionId));
        return res.status(response.statusCode).json(response);
      }
      case "POST": {
        if (generatedIA) {
          const response = await createSummaryWithAI(body.subjectName, Number(userId), Number(collectionId));
          return res.status(response.statusCode).json(response);
        }
        const response = await createSummary(body.content, Number(userId), Number(collectionId));
        return res.status(response.statusCode).json(response);
      }
      default:
        return res.status(405).json({ message: "Method not allowed", error: true, statusCode: 405 });
    }
  }