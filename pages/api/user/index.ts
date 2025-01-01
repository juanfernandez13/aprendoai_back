import { createUser, getAllUsers } from "@/controllers/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
    case "GET": {
      const { statusCode, data } = await getAllUsers();
      return res.status(statusCode).json(data);
    }
    case "POST": {
      const { statusCode, data } = await createUser(body);
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405).send("");
  }
}
