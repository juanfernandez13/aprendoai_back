import { createCard, genereteCards, getAllCardsFromCollection } from "@/controllers/card";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { collectionId, id, genereteIA } = query;
  switch (method) {
    case "GET": {
      const { statusCode, data } = await getAllCardsFromCollection(Number(collectionId));
      return res.status(statusCode).json(data);
    }
    case "POST": {
      if (genereteIA) {
        const {inputUser, quantity} = body
        console.log(body)
        const { statusCode, data } = await genereteCards(inputUser, quantity);
        return res.status(statusCode).json(data);
      }

      const { statusCode, data } = await createCard({
          ...body,
          collectionId: Number(collectionId),
          creatorId: Number(id),
        });
        return res.status(statusCode).json(data);
      
    }

    default:
      return res.status(405).send("Method not allowed");
  }
}
