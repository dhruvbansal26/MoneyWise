import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  context: GetServerSidePropsContext
) {
  try {
    const session = await getSession({ req });
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
      include: {
        tables: true,
      },
    });

    if (!user) {
      // Handle missing user
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (user.tables.length == 0) {
      console.log("No tables found");
      return res.status(200).json({ tables: user.tables });
    }

    console.log("existing tables!!!");
    return res.status(200).json({ tables: user.tables });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
