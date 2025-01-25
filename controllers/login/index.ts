import bcrypt from "bcryptjs";
import { createUser } from "../user";
import { genereteToken } from "@/utils/jwt";
import { PrismaClient } from "@prisma/client";
import { UserSerializer } from "@/serializers/user";

export const loginUser = async (payload: any) => {
  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (user) {
      const isPasswordValid = await bcrypt.compare(payload.password, user.password);
      if (isPasswordValid) {
        const token = genereteToken(user);
        const userSerializer = UserSerializer(user)
        return { token, user: userSerializer, statusCode: 200 };
      } 
      return { message: "senha inválida", statusCode: 400, error: false };
    }
    return { message: "User not found", statusCode: 404, error: false };
  } catch (error) {
    return { data: error, error: true, statusCode: 500 };
  }
};

export const registerUser = async (payload: any) => {
  try {
    const cryptPassword = await bcrypt.hash(payload.password, 10);
    const userData = { ...payload, password: cryptPassword };
    const response = await createUser(userData);
    if (response.error) {
      return response;
    }
    const token = genereteToken(response.data as any);
    return { ...response, data: token };
  } catch (error) {
    return { statusCode: 500, error: true, data: error };
  }
};
