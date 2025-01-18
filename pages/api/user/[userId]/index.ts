import { deleteUserById, getUserById, updateUserById } from "@/controllers/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId } = query;

  switch (method) {
    case "GET": {
      const response = await getUserById(Number(userId));
      return res.status(response.statusCode).json(response);
    }
    case "PUT": {
      const response = await updateUserById(body, Number(userId));
      return res.status(response.statusCode).json(response);
    }
    case "DELETE": {
      const response = await deleteUserById(Number(userId));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
