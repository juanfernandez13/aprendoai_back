import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { searchMethod, page } = query;
  console.log(req)
  switch (method) {
    case "GET":
      return;
    case "POST":
      return;
  }
}
