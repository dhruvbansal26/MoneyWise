import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import Table from "../components/Table";
import { TableInterface } from "@/pages/interfaces";
import { NEXT_URL } from "../config";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/userState";

export default function Dashboard() {
  const [tables, setTables] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function handleTables() {
      try {
        const response = await axios.get("/api/tables/get");
        setTables(response.data.tables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    }
    handleTables();
  }, []);

  const handleCreateTable = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.toLocaleString("en-EN", { month: "long" });
      const year = currentDate.getFullYear();

      const response = await axios.post("/api/tables/create", {
        month,
        year,
        transactions: [],
      });

      if (response.status === 200) {
        const newTable = response.data.table;
        setTables(newTable); // Update tables state with the newly created table
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

      {tables.length === 0 && <p>No tables</p>}
      {tables.length > 0 && tables.map((table, index) => <Table key={index} />)}
    </>
  );
}
