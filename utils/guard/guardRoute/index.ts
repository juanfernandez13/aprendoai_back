import { verifyToken } from "@/utils/jwt";
import type { NextApiRequest } from "next";

interface GuardParams {
  userId?: number;
}

export const GuardRouter = async (req: NextApiRequest, { userId }: GuardParams) => {
  //const { userId } = req.query;
  const { isValid, user } = await verifyToken(req.headers.authorization || "");

  if (!isValid) {
    return { statusCode: 401, message: "Você não está logado", isValid: false };
  }

  if (userId && userId != user.id) {
    return { statusCode: 403, message: "Você não tem permissão", isValid: false };
  }

  return { isValid: true };
};
