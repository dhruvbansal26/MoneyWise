import { Transaction, columns } from "./columns";
import { DataTable } from "./components/DataTable";
import { useState, useEffect } from "react";
async function getData(): Promise<Transaction[]> {
  // Fetch data from your API here.
  const res = await fetch("/api/tables/get");
  const data = await res.json();
  const transaction = data.table.transactions;
  console.log(transaction);
  return transaction;
}

export default function DemoPage() {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getData();
        setData(fetchedData);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
