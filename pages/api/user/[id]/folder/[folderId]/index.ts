import { deleteFolderById, getFolderById, updateFolderById } from "@/controllers/folder";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { folderId } = query;

  switch (method) {
    case "GET": {
      const { statusCode, data } = await getFolderById(Number(folderId));
      return res.status(statusCode).json(data);
    }
    case "PUT": {
      const { statusCode, data } = await updateFolderById(body, Number(folderId));
      return res.status(statusCode).json(data);
    }
    case "DELETE": {
      const { statusCode, data } = await deleteFolderById(Number(folderId));
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405);
  }
}
