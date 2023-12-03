import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { TransactionInterface } from "@/pages/interfaces";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tableId } = req.body;

  const transaction = await prisma.transaction.create({
    data: {
      tableId: tableId,
      amount: 0,
      title: "first",
      description: "first",
    },
  });

  const table = await prisma.transactionTable.findFirst({
    where: {
      id: tableId,
    },
    include: {
      transactions: true,
    },
  });

  res.json({ transaction: transaction });
}
