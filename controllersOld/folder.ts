import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FolderFormat {
  userId: number;
  nameCollection: string;
  foldersId: Array<number>;
}

export const getAllFoldersPerson = async (userId: number) => {
  try {
    const folderData = await prisma.folder.findMany({ where: { userId: userId } });

    return { statusCode: 200, data: folderData };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const getFolderById = async (folderId: number) => {
  try {
    const folderData = await prisma.folder.findUnique({ where: { id: folderId }, include: {collection:true} });

    return { statusCode: 200, data: folderData };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const createFolder = async (folder: any) => {
  try {
    const hasCollection = folder.collections && folder.collections.length > 0;
    const folderData = await prisma.folder.create({
      data: {
        nameFolders: folder.nameFolders,
        userId: folder.userId,
        collection: hasCollection
          ? {
              connect: folder.collections.map((collectionId: number) => ({
                id: collectionId,
              })),
            }
          : undefined,
      },
    });

    return { statusCode: 201, data: folderData };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const updateFolderById = async (folder: any, folderId: number) => {
  const hasCollection = folder.collections && folder.collections.length > 0;
  try {
    const folderData = await prisma.folder.update({
      where: { id: folderId },
      data: {
        nameFolders: folder.nameFolders,
        userId: folder.userId,
        collection: hasCollection
          ? {
              connect: folder.collections.map((collectionId: number) => ({
                id: collectionId,
              })),
            }
          : undefined,
        dateUpdate: new Date(),
      },
    });

    return { statusCode: 200, data: folderData };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const deleteFolderById = async (folderId: number) => {
  try {
    const folderData = await prisma.folder.delete({ where: { id: folderId } });

    return { statusCode: 204, data: folderData };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};
