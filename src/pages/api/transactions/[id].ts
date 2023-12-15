import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/pages/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transactionId = req.query.id;

  if (req.method === "DELETE") {
    const transaction = await prisma.transaction.delete({
      where: {
        id: Number(transactionId),
      },
    });
    res.status(200).json({ transaction: transaction });
  }
}
