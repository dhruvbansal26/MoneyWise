import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const { month, year, transactions } = req.body;

    if (!session) {
      // Not Signed in
      console.log("Not logged in");
      return res.status(401).end();
    }

    // Signed in
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email || "",
      },
    });

    if (!user) {
      // Handle missing user
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user?.id;

    // Check if a table already exists for the given month and year for the user
    const existingTable = await prisma.transactionTable.findFirst({
      where: {
        userId,
        month,
        year,
      },
    });

    if (existingTable?.month == month && existingTable?.year == year) {
      // A table already exists for the given month and year
      console.log("existing table!!!!");
      return res.status(201).json({ table: existingTable });
    }
    // Create a new transaction table
    const newTable = await prisma.transactionTable.create({
      data: {
        month: month,
        year: year,
        userId: userId,
        transactions: {
          create: [],
        },
      },
    });

    console.log("new table!!!");
    return res.status(200).json({ table: newTable });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
