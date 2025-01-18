import { PrismaClient } from "@prisma/client";
import { createProgress } from "./progress";

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

export const getCollectionById = async (collectionId: number, creatorId: number) => {
  try {
    const collectionData = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        folder: true,
        cards: true,
      },
    });

    if (!collectionData) return { statusCode: 200, data: "Collection Not Found" };
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
    let collectionData;
    await prisma.$transaction(async (prisma) => {
      const collectionDataAssociated = await prisma.userCollection.create({
        data: {
          userId: body.userId,
          collectionId: body.collectionId,
        },
      });
      collectionData = collectionDataAssociated;
      await createProgress({ collectionId: body.collectionId, userId: body.userId });
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
      where: { id: collectionId, creatorId: Number(collection.creatorId) },
      data: {
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
  } catch (error: any) {
    if (error.meta.cause === "Record to update not found.") {
      return { statusCode: 404, data: "Not found" };
    }

    return { statusCode: 500, data: error };
  }
};

export const deleteCollectionById = async (collectionId: number, creatorId: number) => {
  try {
    const collectionData = await prisma.collection.delete({ where: { id: collectionId, creatorId: creatorId } });
    return { statusCode: 204, data: collectionData };
  } catch (error: any) {
    if (error.meta.cause === "Record to delete does not exist.") {
      return { statusCode: 404, data: "Not found" };
    }
    return { statusCode: 500, data: error };
  }
};
