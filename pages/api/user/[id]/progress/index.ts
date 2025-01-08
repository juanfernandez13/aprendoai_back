import { createProgress, getAllProgressUser } from "@/controllers/progress";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { id } = query;

  switch (method) {
    case "GET": {
      const { statusCode, data } = await getAllProgressUser(Number(id));
      return res.status(statusCode).json(data);
    }
    case "POST": {
      console.log({ ...body, userId: id });
      const { statusCode, data } = await createProgress({ ...body, userId: Number(id) });
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405).send("");
  }
}
