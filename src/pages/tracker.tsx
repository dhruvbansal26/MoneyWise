import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import TableComponent from "./components/Table";
import { TableInterface } from "@/pages/interfaces";
import axios from "axios";
import prisma from "@/lib/prisma";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

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

export default function Tracker({ initialTables }: Props) {
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
        toast.success("Table created!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        const newTable = response.data.table;
        setTables([...tables, newTable]);
      }
      if (response.status === 201) {
        toast.info("Table already exists!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        const existingTable = response.data.table;
        console.log(existingTable);
      }
    } catch (error) {
      toast.error("Error creating table!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
      <Button onClick={handleCreateTable}>Create Table</Button>
      {tables && tables.length === 0 && <p>No tables</p>}
      {tables &&
        tables.length > 0 &&
        tables.map((table) => <TableComponent key={table.id} table={table} />)}
    </>
  );
}
