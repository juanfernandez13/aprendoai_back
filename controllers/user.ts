import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  try {
    const Person = await prisma.user.findMany();

    return { statusCode: 200, data: Person };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const getUserById = async (userId: number) => {
  try {
    const Person = await prisma.user.findUnique({
      where: { id: userId },
      include: { folder: true, collection: true, progress: true },
    });

    if (!Person) return { statusCode: 404, data: { error: "user not found" } };

    return { statusCode: 200, data: Person };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

interface UserFormat {
  firstName: string;
  lastName: string;
  password: string;
  number: string;
  email: string;
}

export const createUser = async (user: UserFormat) => {
  try {
    const userCreated = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        number: user.number,
        email: user.email,
      },
    });

    return { statusCode: 201, data: userCreated };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const UpdateUserById = async (user: UserFormat, userId: number) => {
  try {
    const userUpdated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        number: user.number,
        email: user.email,
        dateUpdate: new Date(),
      },
    });
    if (!user) return { statusCode: 404, data: { error: "user not found" } };

    return { statusCode: 200, data: userUpdated };
  } catch (error) {
    return { statusCode: 500, error: error };
  }
};

export const deleteUserById = async (userId: number) => {
  try {
    const userDeleted = await prisma.user.delete({ where: { id: userId } });

    if (!userDeleted) return { statusCode: 404, data: { error: "user not found" } };

    return { statusCode: 200, data: userDeleted };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};
