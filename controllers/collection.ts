import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CollectionFormat {
  creatorId: number;
  nameCollection: string;
  folders: Array<number>;
}

export const getAllCollectionPerson = async (creatorId: number) => {
  try {
    // const collectionData = await prisma.collection.findMany({ where: { creatorId: creatorId } },);
    const collectionData = await prisma.collection.findMany({
      where: {
        OR: [
          {
            associatedCollection: {
              some: { userId: creatorId },
            },
          },
          { creatorId: creatorId },
        ],
      },
    });

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
        cards: true,
      },
    });

    return { statusCode: 200, data: collectionData };
  } catch (error) {
    return { statusCode: 500, data: "" };
  }
};
export const searchCollection = async (searchQuery: string, page: number, quantity: number) => {
  try {
    const collectionData = await prisma.collection.findMany({
      where: { nameCollection: { contains: searchQuery } },
      take: quantity,
      skip: quantity * (page - 1),
    });

    return { statusCode: 200, data: collectionData };
  } catch (error) {
    return { statusCode: 500, data: "" };
  }
};

export const associateUserCollection = async (body: any) => {
  try {
    const all = await prisma.userCollection.findMany();
    const collectionData = await prisma.userCollection.create({
      data: {
        userId: body.userId,
        collectionId: body.collectionId,
      },
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
        creatorId: collection.creatorId,
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
    return { statusCode: 500, data: error };
  }
};

export const updateCollectionById = async (collection: CollectionFormat, collectionId: number) => {
  try {
    const hasFolders = collection.folders && collection.folders.length > 0;

    const collectionData = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        creatorId: collection.creatorId,
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
