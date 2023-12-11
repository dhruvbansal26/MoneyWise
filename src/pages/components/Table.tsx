import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { TableInterface, TransactionInterface } from "@/pages/interfaces";
import { toast } from "react-toastify";
import { useAsyncList } from "@react-stately/data";

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
} from "@nextui-org/react";

interface Props {
  table: TableInterface;
}

export default function TableComponent({ table }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [transactions, setTransactions] = useState<TransactionInterface[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [split, setSplit] = useState(false);
  const [splitcount, setSplitcount] = useState("");
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState(new Set(["text"]));
  const selectedValue = useMemo(
    () => Array.from(category).join(", ").replaceAll("_", " "),
    [category]
  );
  useEffect(() => {
    const total = transactions.reduce((acc, t) => {
      return acc + t.amount;
    }, 0);

    setTotal(total);
  }, [transactions]);

  useEffect(() => {
    setTransactions(table.transactions);

    transactions.map((t) => total == t.amount);
  }, [table.transactions]);

  async function addTransaction() {
    if (!title || !description || !amount) {
      toast.error("Please fill all fields!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const tableId = table.id;
    try {
      const response = await axios.post("/api/transactions", {
        tableId,
        title,
        amount,
        description,
        selectedValue,
        split,
        splitcount,
      });

      if (response.status === 200) {
        toast.success("Transaction logged!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          response.data.transaction, // Assuming the response contains a single transaction
        ]);
        onOpenChange();
      }
    } catch (error) {
      toast.error("Error creating transaction!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error("Error creating transaction:", error);
    }
  }

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
        setTransactions((prev) => prev.filter((t) => t.id !== id));
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

      <Table>
        <TableHeader>
          <TableColumn>Title</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody>
          {transactions &&
            transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>${t.amount}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>
                  <Button onClick={() => deleteTransaction(t.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Button onPress={onOpen}>Create Transaction</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Transaction
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  type="Number"
                  placeholder="Amount"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" className="capitalize">
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Single selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={category}
                    onSelectionChange={setCategory}
                  >
                    <DropdownItem key="text">Text</DropdownItem>
                    <DropdownItem key="number">Number</DropdownItem>
                    <DropdownItem key="date">Date</DropdownItem>
                    <DropdownItem key="single_date">Single Date</DropdownItem>
                    <DropdownItem key="iteration">Iteration</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Checkbox
                  isSelected={split}
                  onChange={(e) => setSplit(e.target.checked)}
                  aria-label="Split transaction checkbox"
                >
                  Split?
                </Checkbox>

                {split && (
                  <Input
                    type="Number"
                    placeholder="Split Count"
                    onChange={(e) => setSplitcount(e.target.value)}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={addTransaction}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div>Total: {total}</div>
    </div>
  );
}
