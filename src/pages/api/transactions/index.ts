import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tableId, title, amount, description, category, split, splitcount } =
    req.body;

  if (split == true) {
    const transaction = await prisma.transaction.create({
      data: {
        tableId: tableId,
        amount: parseInt(amount) / splitcount,
        title: title,
        description: description,
        split: split,
        splitcount: parseInt(splitcount),
        category: category,
      },
    });
    res.status(200).json({ transaction: transaction });
  } else {
    const transaction = await prisma.transaction.create({
      data: {
        tableId: tableId,
        amount: parseInt(amount),
        title: title,
        description: description,
        split: split,
        splitcount: parseInt(splitcount),
        category: category,
      },
    });

    res.status(200).json({ transaction: transaction });
  }
}
