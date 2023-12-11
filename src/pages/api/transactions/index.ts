import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    tableId,
    title,
    amount,
    description,
    selectedValue,
    split,
    splitcount,
  } = req.body;

  const transaction = await prisma.transaction.create({
    data: {
      tableId: tableId,
      amount: parseInt(amount),
      title: title,
      description: description,
      split: split,
      splitcount: parseInt(splitcount),
      category: selectedValue,
    },
  });

  res.status(200).json({ transaction: transaction });
}
