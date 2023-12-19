import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const { tableId } = req.body;
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

    const table = await prisma.transactionTable.findUnique({
      where: {
        id: tableId,
      },
      include: {
        transactions: true,
      },
    });
    console.log("tables!!!");
    return res.status(200).json({ table: table });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
