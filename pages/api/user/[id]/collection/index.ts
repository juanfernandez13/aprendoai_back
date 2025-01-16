import type { NextApiRequest, NextApiResponse } from "next";
import { createCollection, getAllCollectionPerson } from "@/controllers/collection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { id } = query;
  switch (method) {
    case "GET": {
      const { statusCode, data } = await getAllCollectionPerson(Number(id));
      return res.status(statusCode).json(data);
    }
    case "POST": {
      const { statusCode, data } = await createCollection({ ...body, creatorId: Number(id) });
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405).send("");
  }
}
