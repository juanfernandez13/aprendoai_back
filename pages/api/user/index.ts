import { createUser, getAllUsers } from "@/controllers/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
    case "GET": {
      const response = await getAllUsers();
      return res.status(response.statusCode).json(response);
    }
    // case "POST": {
    //   const response = await createUser(body);
    //   return res.status(response.statusCode).json(response);
    // }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
