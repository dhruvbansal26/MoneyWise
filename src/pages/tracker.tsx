import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import TableComponent from "./components/Table";
import { TableInterface } from "@/pages/interfaces";
import axios from "axios";
import prisma from "@/pages/lib/prisma";
import { Button } from "./components/ui/button";
import { toast } from "react-toastify";
import { useEffect } from "react";
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
  console.log(tables);
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

  async function createTable() {
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
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        const newTable = response.data.table;
        setTables([...tables, newTable]);
      }
    } catch (error) {
      toast.error("Error creating table!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error creating table:", error);
    }
  }
  async function deleteTable(id: string) {
    try {
      const response = await axios.delete(`/api/tables/${id}`);
      if (response.status === 200) {
        toast.success("Table deleted!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      setTables((prevTables) => prevTables.filter((table) => table.id !== id));
    } catch (error) {
      toast.success("Error deleting table!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error deleting table:", error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center pt-14">
        <h1 className="text-4xl font-bold">Tracker</h1>
        <p className="text-xl text-muted-foreground">
          Track your daily expenses!
        </p>
        <Button onClick={createTable} className="m-4">
          Create Table
        </Button>
        {tables && tables.length === 0 && (
          <>
            <p className="mt-16 text-muted-foreground">No tables found.</p>
          </>
        )}

        {tables &&
          tables.length > 0 &&
          tables.map((table) => (
            <>
              <div key={table.id}>
                <TableComponent key={table.id} table={table} />
                <Button onClick={() => deleteTable(table.id)}>
                  Delete Table
                </Button>
              </div>
            </>
          ))}
      </div>
    </>
  );
}
