import { useState } from "react";
import { columns } from "./columns";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { TableInterface } from "@/pages/interfaces";
import axios from "axios";
import prisma from "@/pages/lib/prisma";
import { Button } from "./components/ui/button";
import { toast } from "react-toastify";
import { DataTable } from "./components/DataTable";
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
interface Props {
  initialTables: TableInterface[];
}

import { useEffect } from "react";
import { tableState } from "./store/atoms/tableState";

import { tablesListState } from "./store/atoms/tablesListState";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";

export default function Tracker({ initialTables }: Props) {
  // const [tables, setTables] = useState<Array<TableInterface>>(initialTables);
  // const setTables = useSetRecoilState(tables);
  const setTables = useSetRecoilState(tablesListState("dev"));
  const tables = useRecoilValue(tablesListState("dev"));

  useEffect(() => {
    setTables({
      tables: initialTables,
      length: initialTables.length,
    });
  }, []);

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
        // setTables([...tables, newTable]);
        setTables((prevTables) => {
          return {
            tables: [...prevTables.tables, newTable],
            length: [...prevTables.tables, newTable].length,
          };
        });
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
      // setTables((prevTables) => prevTables.filter((table) => table.id !== id));
      // setTables((prevTables) => {
      //   return {
      //     tables: prevTables.tables.filter((t) => t.id !== id),
      //     length: prevTables.length - 1,
      //   };
      // });
      setTables((prevTables) => {
        const filtered = prevTables.tables.filter((t) => t.id !== id);

        return {
          tables: filtered,
          length: filtered.length,
        };
      });
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
          tables.tables.length > 0 &&
          tables.tables.map((table) => (
            <>
              <div key={`div-${table.id}`}>
                <DataTable
                  key={table.id}
                  columns={columns}
                  data={table.transactions}
                  inputTable={table}
                />
                {/* <Button
                  key={`button-${table.id}`}
                  onClick={() => deleteTable(table.id)}
                >
                  Delete Table
                </Button> */}
              </div>
            </>
          ))}
      </div>
    </>
  );
}
