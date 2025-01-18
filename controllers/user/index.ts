import { PrismaClient } from "@prisma/client";

export const getUserById = async (userId: number) => {
  try {
    const prisma = new PrismaClient();

    const includeData = { collection: true, folder: true, friendsList: true, userAchievements: true };
    const user = await prisma.user.findUnique({ where: { id: userId }, include: includeData });

    const response = { data: user, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const getAllUsers = async () => {
  try {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();

    const response = { data: users, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const createUser = async (userData: any) => {
  try {
    const prisma = new PrismaClient();

    const response = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
        },
      });

      await prisma.friendsList.create({ data: { userId: user.id } });
      return { data: user, statusCode: 201, error: false };
    });

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const updateUserById = async (userData: any, userId: number) => {
  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        dateUpdate: new Date(),
      },
    });

    const response = { data: user, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const deleteUserById = async (userId: number) => {
  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.delete({
      where: { id: userId },
    });

    const response = { data: user, statusCode: 204, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
