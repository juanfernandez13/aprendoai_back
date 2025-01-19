import { PrismaClient } from "@prisma/client";

export const getFriendList = async (userId: number) => {
  try {
    const prisma = new PrismaClient();

    const friendList = await prisma.friendsList.findUnique({ where: { userId: userId } });

    if (!friendList) {
      const response = { data: {}, statusCode: 404, error: false };
      return response;
    }

    const UsersFriends = await Promise.all(friendList.friendsList.map((friendId) => {
        return prisma.user.findUnique({ where: { id: friendId } });
    }))

    const response = { data: { friendList, UsersFriends }, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
export const inviteFriendship = async (email: string, userInvitesId: number) => {
  try {
    const prisma = new PrismaClient();

    const guestUser = await prisma.user.findUnique({ where: { email: email } });

    if (!guestUser) {
      const response = { data: {}, statusCode: 404, error: false };
      return response;
    }
    const { id } = guestUser;

    const friendList = await prisma.friendsList.update({
      where: { userId: id },
      data: { solicitaions: { push: userInvitesId } },
    });

    const response = { data: friendList, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const removeGuestFriendship = async (userId: number, userIdToRemove: number) => {
  try {
    const prisma = new PrismaClient();

    const affectedRows = await prisma.$queryRaw`UPDATE "FriendsList"
        SET "solicitaions" = array_remove("solicitaions", ${userIdToRemove}),
        "dateUpdate" = now()
        WHERE "userId" = ${userId};`;
    const response = { message: "vencemo", statusCode: 200, error: true };

    console.log(`Linhas afetadas: ${affectedRows}`);
    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
export const removeFriendship = async (userId: number, userIdToRemove: number) => {
  try {
    const prisma = new PrismaClient();

    await prisma.$queryRaw`UPDATE "FriendsList"
        SET "friendsList" = array_remove("friendsList", ${userIdToRemove}),
        "dateUpdate" = now()
        WHERE "userId" = ${userId};`;
    const response = { message: "vencemo", statusCode: 200, error: true };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const acceptGuestFriendship = async (userId: number, userIdToAccept: number) => {
  try {
    const prisma = new PrismaClient();

    const response = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return { data: {}, statusCode: 404, error: false };
      }
      const { id } = user;

      const friendList = await prisma.friendsList.findUnique({where: {userId: userId}})
      if (friendList?.friendsList.includes(userIdToAccept)){
        return { message: "Convite já aceito", statusCode: 409, error: false };
      }
        const friendListUpdated = await prisma.friendsList.update({
          where: { userId: id },
          data: { friendsList: { push: userIdToAccept } },
        });

      await prisma.$queryRaw`UPDATE "FriendsList"
        SET "solicitaions" = array_remove("solicitaions", ${userIdToAccept}),
        "dateUpdate" = now()
        WHERE "userId" = ${userId};`;

      return { data: friendListUpdated, statusCode: 200, error: false };
    });

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
