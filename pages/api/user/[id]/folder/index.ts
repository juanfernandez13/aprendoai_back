import { createFolder, getAllFoldersPerson } from "@/controllers/folder";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { id } = query;
  switch (method) {
    case "GET": {
      const { statusCode, data } = await getAllFoldersPerson(Number(id));
      return res.status(statusCode).json(data);
    }
    case "POST": {
      const { statusCode, data } = await createFolder({ ...body, userId: Number(id) });
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405).send("Method not allowed");
  }
}
