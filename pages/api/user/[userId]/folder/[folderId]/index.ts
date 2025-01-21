import { deleteFolder, getFolderById, updateFolder } from "@/controllers/folder";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { folderId } = query;

  switch (method) {
    case "GET": {
      const response = await getFolderById(Number(folderId));
      return res.status(response.statusCode).json(response);
    }
    case "PUT": {
      const response = await updateFolder(body, Number(folderId));
      return res.status(response.statusCode).json(response);
    }
    case "DELETE": {
      const response = await deleteFolder(Number(folderId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
