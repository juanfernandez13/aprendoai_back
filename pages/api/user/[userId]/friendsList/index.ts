import {
  acceptGuestFriendship,
  getFriendList,
  inviteFriendship,
  removeFriendship,
  removeGuestFriendship,
} from "@/controllers/friends";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { userId, noAccept } = query;

  switch (method) {
    case "GET": {
      const response = await getFriendList(Number(userId));
      return res.status(response.statusCode).json(response);
    }

    case "POST": {
      const { email } = body;
      const response = await inviteFriendship(email, Number(userId));
      return res.status(response.statusCode).json(response);
    }

    case "PUT": {
      if (noAccept) {
        const { userIdToNotAccept } = body;
        const response = await removeGuestFriendship(Number(userId), Number(userIdToNotAccept));
        return res.status(response.statusCode).json(response);
      }
      const { userIdToAccept } = body;
      const response = await acceptGuestFriendship(Number(userId), Number(userIdToAccept));
      return res.status(response.statusCode).json(response);
    }

    case "DELETE": {
      const { userIdToRemove } = body;
      const response = await removeFriendship(Number(userId), Number(userIdToRemove));
      return res.status(response.statusCode).json(response);
    }

    default:
      return res.status(405).json({ message: "Method not allowed", error: false, statusCode: 405 });
  }
}
