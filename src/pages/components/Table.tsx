import { useEffect } from "react";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import { TableInterface } from "@/pages/interfaces";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { useRecoilState } from "recoil";
import TransactionModal from "./TransactionModal";
import { tableFamily } from "../store/atoms/tableFamily";
import { useMemo } from "react";

interface Props {
  table: TableInterface;
}

export default function TableComponent({ table }: Props) {
  const atom = useMemo(() => tableFamily(table.id), [table.id]);
  const [tableState, setTableState] = useRecoilState(atom);

  useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      transactions: table.transactions,
    }));
  }, [table.transactions]);

  const calculateTotal = () => {
    let total = 0;

    // Check if tableState is defined and has transactions
    if (tableState && tableState.transactions) {
      tableState.transactions.forEach((transaction) => {
        total += transaction.amount;
      });
    }

    return total;
  };

  const totalAmount = calculateTotal();

  const calculateTotalByCategory = () => {
    const categoryTotals: { [key: string]: number } = {};

    // Check if tableState and transactions are defined
    if (tableState && tableState.transactions) {
      tableState.transactions.forEach((transaction) => {
        if (categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] += transaction.amount;
        } else {
          categoryTotals[transaction.category] = transaction.amount;
        }
      });
    }

    return categoryTotals;
  };

  const totalByCategory = calculateTotalByCategory();

  async function deleteTransaction(id: Number) {
    try {
      const response = await axios.delete(`/api/transactions/${id}`);

      if (response.status === 200) {
        toast.success("Transaction deleted!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTableState((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id),
        }));
      }
    } catch (error) {
      toast.error("Error deleting transaction!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error deleting transaction:", error);
    }
  }

  return (
    <div className="bg-gray-100 p-8">
      <div className="mb-4 text-lg font-medium">
        {table.month} {table.year}
      </div>

      <Table aria-label="Example table with client side sorting">
        <TableHeader>
          <TableColumn key="title" allowsSorting>
            Title
          </TableColumn>
          <TableColumn key="description" allowsSorting>
            Description
          </TableColumn>
          <TableColumn key="amount" allowsSorting>
            Amount
          </TableColumn>
          <TableColumn key="category" allowsSorting>
            Category
          </TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>

        <TableBody>
          {tableState &&
            tableState.transactions &&
            tableState.transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.title}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(transaction.amount)}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Button onClick={() => deleteTransaction(transaction.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        Total Amount:{" "}
        {totalAmount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </div>

      <div className="mt-4">
        <h3>Total by Category:</h3>
        <ul>
          {Object.keys(totalByCategory).map((category) => (
            <li key={category}>
              {category}:{" "}
              {totalByCategory[category].toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </li>
          ))}
        </ul>
      </div>
      <TransactionModal table={table} />
    </div>
  );
}
