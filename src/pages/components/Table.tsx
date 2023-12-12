import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { TableInterface } from "@/pages/interfaces";
import { tableState } from "../store/atoms/tableState";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Checkbox,
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  getKeyValue,
} from "@nextui-org/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import TransactionModal from "./TransactionModal";

interface Props {
  table: TableInterface;
}

export default function TableComponent({ table }: Props) {
  const setTableState = useSetRecoilState(tableState);
  const tableId = useRecoilValue(tableState).id;
  const tableTransactions = useRecoilValue(tableState).transactions;
  useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      id: table.id,
      transactions: table.transactions,
    }));
  }, [table.id, setTableState]);

  async function deleteTransaction(id: Number) {
    try {
      const response = await axios.delete(`/api/transactions/${id}`);

      if (response.status === 200) {
        toast.success("Transaction deleted!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTableState((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id),
        }));
      }
    } catch (error) {
      toast.error("Error deleting transaction!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
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
          <TableColumn key="actions" allowsSorting>
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody>
          {tableTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.title}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
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

      <TransactionModal />
    </div>
  );
}
