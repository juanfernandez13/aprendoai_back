import { PrismaClient } from "@prisma/client";

export const getFolderById = async (folderId: number) => {
  try {
    const prisma = new PrismaClient();
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {collection: true}
    });

    const response = { data: folder, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const getFoldersByUserId = async (userId: number, quantity: number, page: number) => {
  try {
    const prisma = new PrismaClient();
    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
      },
      take: quantity,
      skip: quantity * (page - 1),
    });

    const response = { data: folders, statusCode: 200, error: false };
    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const getFoldersByParams = async (textSearch: string, quantity: number, page: number) => {
  try {
    const prisma = new PrismaClient();

    const folders = await prisma.folder.findMany({
      where: {
        nameFolder: { contains: textSearch },
      },
      take: quantity,
      skip: quantity * (page - 1),
    });

    const response = { data: folders, statusCode: 200, error: false };
    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const createFolder = async (folderData: any, userId: number) => {
  try {
    const prisma = new PrismaClient();
    const folder = await prisma.folder.create({
      data: {
        userId: userId,
        nameFolder: folderData.nameFolder,
      },
    });
    const response = { data: folder, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const updateFolder = async (folderData: any, folderId: any) => {
  try {
    const prisma = new PrismaClient();
    const folder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        nameFolder: folderData.nameFolder,
        collection: { connect: { id: folderData.collectionId } },
      },
    });
    const response = { data: folder, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const deleteFolder = async (folderId: any) => {
  try {
    const prisma = new PrismaClient();
    const folder = await prisma.folder.delete({
      where: { id: folderId },
    });
    const response = { data: folder, statusCode: 204, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
