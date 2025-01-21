import { createFolder, getFoldersByUserId } from "@/controllers/folder";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, quantity = 12, page = 1 } = query;

  switch (method) {
    case "GET": {
      const response = await getFoldersByUserId(Number(userId), Number(quantity), Number(page));
      return res.status(response.statusCode).json(response);
    }
    case "POST": {
      const response = await createFolder(body, Number(userId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
