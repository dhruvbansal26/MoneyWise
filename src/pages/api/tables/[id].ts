import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tableId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (req.method === "DELETE") {
    const transactions = await prisma.transaction.deleteMany({
      where: {
        tableId: tableId,
      },
    });

    const table = await prisma.transactionTable.delete({
      where: {
        id: tableId,
      },
    });
    res.status(200).json({ table: table });
  }
}
