import { PrismaClient } from "@prisma/client";

export const getCollectionsById = async (collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const collections = await prisma.collection.findUnique({
      where: {
        id: collectionId,
      },
    });

    const response = { data: collections, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const getCollectionsByFolderId = async (folderId: number, quantity: number, page: number) => {
  try {
    const prisma = new PrismaClient();
    const collections = await prisma.collection.findMany({
      where: {
        folder: {
          some: { id: folderId } // Ajuste para usar 'folder' corretamente no relacionamento de muitos para muitos
        },
      },
      take: quantity,
      skip: quantity * (page - 1),  // Controle da paginação
    });

    const response = { data: collections, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};







export const getCollectionsByUserId = async (userId: number, quantity: number, page: number) => {
  try {
    const prisma = new PrismaClient();
    const collections = await prisma.collection.findMany({
      where: {
        userId: userId,
      },
      take: quantity,
      skip: quantity * (page - 1),
    });
    const response = { data: collections, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const getCollectionsByParams = async (textSearch: string, quantity: number, page: number) => {
  try {
    const prisma = new PrismaClient();
    const collections = await prisma.collection.findMany({
      where: {
        nameCollection: { contains: textSearch },
      },
      take: quantity,
      skip: quantity * (page - 1),
    });
    const response = { data: collections, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const createCollection = async (collectionData: any) => {
  try {
    const prisma = new PrismaClient();
    const collection = await prisma.collection.create({
      data: {
        userId: collectionData.userId,
        nameCollection: collectionData.nameCollection,
        resumeCollection: collectionData.resumeCollection,
        folder: {
          connect: { id: collectionData.folderId }, // Conecta a coleção à pasta com folderId
        },
      },
    });

    const response = { data: collection, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};


export const updateCollectionById = async (collectionData: any, collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        nameCollection: collectionData.nameCollection,
        resumeCollection: collectionData.resumeCollection,
        dateUpdate: new Date(),
      },
    });
    const response = { data: collection, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};

export const deleteCollectionById = async (collectionId: number) => {
  try {
    const prisma = new PrismaClient();
    const collection = await prisma.collection.delete({
      where: { id: collectionId },
    });
    const response = { data: collection, statusCode: 200, error: false };

    return response;
  } catch (error) {
    const response = { message: error, statusCode: 500, error: true };

    return response;
  }
};
