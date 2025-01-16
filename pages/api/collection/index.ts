import { searchCollection } from "@/controllers/collection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const { searchText, page = 1, quantity = 12 } = query;
  switch (method) {
    case "GET":
      const response = await searchCollection(
        `${searchText === undefined ? "" : searchText}`,
        Number(page),
        Number(quantity)
      );
      return res.status(200).json(response);
    default:
      return res.status(409).json({ error: "Method not allowed" });
  }
}
