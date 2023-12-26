import { columns } from "../columns";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { TableInterface, TransactionInterface } from "@/interfaces";
import axios from "axios";
import prisma from "@/lib/prisma";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import { DataTable } from "../components/DataTable";
import { useEffect } from "react";
import { tablesListState } from "../store/atoms/tablesListState";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tableState } from "../store/atoms/tableState";
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
  const setTablesList = useSetRecoilState(tablesListState("dev"));
  const tablesList = useRecoilValue(tablesListState("dev"));
  useEffect(() => {
    setTablesList({
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
        console.log(newTable);
        setTablesList((prevTables) => {
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
        {tablesList && tablesList.length === 0 && (
          <>
            <p className="mt-16 text-muted-foreground">No tables found.</p>
          </>
        )}

        {tablesList &&
          tablesList.tables.length > 0 &&
          tablesList.tables.map((table) => (
            <>
              <div key={`div-${table.id}`}>
                <DataTable
                  key={table.id}
                  columns={columns}
                  data={table.transactions}
                  inputTable={table}
                />
              </div>
            </>
          ))}
      </div>
    </>
  );
}
