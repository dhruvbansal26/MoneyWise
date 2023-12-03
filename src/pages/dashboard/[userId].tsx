import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import Table from "../components/Table";
import { TableInterface } from "@/pages/interfaces";
import { BASE_URL, NEXT_URL } from "../config";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/userState";
import prisma from "@/lib/prisma";
import { init } from "next/dist/compiled/webpack/webpack";
import { TransactionInterface } from "@/pages/interfaces";
import { table } from "console";

interface Props {
  initialTables: TableInterface[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      props: {},
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email || "",
    },
  });

  const tables = await prisma.transactionTable.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      transactions: true,
    },
  });
  return {
    props: {
      session,
      initialTables: tables,
    },
  };
}

export default function Dashboard({ initialTables }: Props) {
  const { data: session, status } = useSession();
  const [tables, setTables] = useState<Array<TableInterface>>(initialTables);
  const router = useRouter();

  const handleCreateTable = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.toLocaleString("en-EN", { month: "long" });
      const year = currentDate.getFullYear();
      const response = await axios.post("/api/tables", {
        month,
        year,
      });

      if (response.status === 200) {
        const newTable = response.data.table;
        setTables([...tables, newTable]);
      }
      if (response.status === 201) {
        const existingTable = response.data.table;
        console.log(existingTable);
      }
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session) {
    router.push("/");
  }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
      <button onClick={handleCreateTable}>Create Table</button>

      {tables && tables.length === 0 && <p>No tables</p>}
      {tables &&
        tables.length > 0 &&
        tables.map((table) => <Table key={table.id} table={table} />)}
    </>
  );
}
