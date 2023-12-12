import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Checkbox,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import axios from "axios";

import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tableState } from "../store/atoms/tableState";

interface IFormInput {
  amount: number;
  title: string;
  description: string;
  category: string;
  split?: boolean;
  splitcount?: number;
}

export default function TransactionModal() {
  const setTableState = useSetRecoilState(tableState);
  const tableId = useRecoilValue(tableState).id;
  const tableTransactions = useRecoilValue(tableState).transactions;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [split, setSplit] = useState(false);
  const [splitcount, setSplitcount] = useState("");
  const [category, setCategory] = useState(new Set(["text"]));
  const selectedValue = useMemo(
    () => Array.from(category).join(", ").replaceAll("_", " "),
    [category]
  );

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
        setTableState((prev) => ({
          ...prev,
          transactions: [...prev.transactions, response.data.transaction],
        }));
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
  return (
    <>
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
                    //@ts-ignore
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
    </>
  );
}