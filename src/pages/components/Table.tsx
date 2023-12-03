import { useState, useEffect } from "react";
import axios from "axios";

import { TableInterface, TransactionInterface } from "@/pages/interfaces";

interface Props {
  table: TableInterface;
}

export default function Table({ table }: Props) {
  const [transactions, setTransactions] = useState<TransactionInterface[]>([]);

  useEffect(() => {
    setTransactions(table.transactions);
  }, [table.transactions]);

  async function addTransaction() {
    // Logic to add transaction
    const tableId = table.id;

    const response = await axios.post("/api/transactions", {
      tableId,
    });

    setTransactions((prevTransactions) => [
      ...prevTransactions,
      response.data.transaction, // Assuming the response contains a single transaction
    ]);
  }

  async function deleteTransaction(id: Number) {
    try {
      await axios.delete(`/api/transactions/${id}`);

      setTransactions((prev) => prev.filter((t) => t.id !== id));

      console.log("Transaction deleted!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-100 p-8">
      <div className="mb-4 text-lg font-medium">
        {table.month} {table.year}
      </div>

      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-100 border-b-2 border-gray-200 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                  Title
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b-2 border-gray-200 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                  Description
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b-2 border-gray-200 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {t.title}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {t.description}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {t.amount}
                  </td>
                  <td>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => deleteTransaction(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={addTransaction}
      >
        Add Transaction
      </button>
    </div>
  );
}
