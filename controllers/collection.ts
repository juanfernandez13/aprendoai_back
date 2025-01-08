import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CollectionFormat {
  userId: number;
  nameCollection: string;
  folders: Array<number>;
}

export const getAllCollectionPerson = async (userId: number) => {
  try {
    const collectionData = await prisma.collection.findMany({ where: { userId: userId } });

    return { statusCode: 200, data: collectionData };
  } catch (error) {
    return { statusCode: 500, data: "" };
  }
};

export const getCollectionById = async (collectionId: number) => {
  try {
    const collectionData = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        folder: true,
        cards: true
      },
    });

    return { statusCode: 200, data: collectionData };
  } catch (error) {
    return { statusCode: 500, data: "" };
  }
};
export const searchCollection = async (searchQuery: string, page:number, quantity: number) => {
  try {
    const collectionData = await prisma.collection.findMany({
      where: {nameCollection: {contains: searchQuery}},
      take:quantity,
      skip: quantity*(page-1)
    });

    return { statusCode: 200, data: collectionData };
  } catch (error) {
    return { statusCode: 500, data: "" };
  }
};
export const associateUserCollection = async (body:any) => {
  try {
    const all = await prisma.userCollection.findMany()
    console.log(all, body)
    const collectionData = await prisma.userCollection.create({
      data: {
        userId: body.userId,
        collectionId: body.collectionId,
      }
    });
    return { statusCode: 200, data: collectionData };
  } catch (error) {
    return { statusCode: 500, error: error };
  }
};

export const createCollection = async (collection: CollectionFormat) => {
  try {
    const hasFolders = collection.folders && collection.folders.length > 0;
    const collectionData = await prisma.collection.create({
      data: {
        userId: collection.userId,
        nameCollection: collection.nameCollection,
        folder: {
          connect: hasFolders
            ? collection.folders.map((folderId) => {
                return { id: folderId };
              })
            : undefined,
        },
      },
    });
    return { statusCode: 201, data: collectionData };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, data: error };
  }
};

export const updateCollectionById = async (collection: CollectionFormat, collectionId: number) => {
  try {
    const hasFolders = collection.folders && collection.folders.length > 0;

    const collectionData = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        userId: collection.userId,
        nameCollection: collection.nameCollection,
        dateUpdate: new Date(),
        folder: {
          connect: hasFolders
            ? collection.folders.map((folderId) => {
                return { id: folderId };
              })
            : undefined,
        },
      },
    });

    return { statusCode: 200, data: collectionData };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};

export const deleteCollectionById = async (collectionId: number) => {
  try {
    const collectionData = await prisma.collection.delete({ where: { id: collectionId } });
    return { statusCode: 204, data: collectionData };
  } catch (error) {
    return { statusCode: 500, data: error };
  }
};
