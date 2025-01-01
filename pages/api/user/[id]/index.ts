import { deleteUserById, getUserById, UpdateUserById } from "@/controllers/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { id } = query;

  switch (method) {
    case "GET": {
      const { statusCode, data } = await getUserById(Number(id));
      return res.status(statusCode).json(data);
    }
    case "PUT": {
      const { statusCode, data } = await UpdateUserById(body, Number(id));
      return res.status(statusCode).json(data);
    }
    case "DELETE": {
      const { statusCode, data } = await deleteUserById(Number(id));
      return res.status(statusCode).json(data);
    }

    default:
      return res.status(405);
  }
}
