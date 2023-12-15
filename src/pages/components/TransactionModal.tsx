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
import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { tableFamily } from "../store/atoms/tableFamily";
import { TableInterface } from "../interfaces";
interface Props {
  table: TableInterface;
}
export default function TransactionModal({ table }: Props) {
  const [tableState, setTableState] = useRecoilState(tableFamily(table.id));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [split, setSplit] = useState(false);
  const [splitcount, setSplitcount] = useState("");
  const [category, setCategory] = useState(new Set(["Other"]));
  const selectedValue = useMemo(
    () => Array.from(category).join(", ").replaceAll("_", " "),
    [category]
  );

  async function addTransaction() {
    if (!title.trim() || !description.trim() || !amount.trim()) {
      toast.error("Please fill all fields!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    try {
      const tableId = table.id;
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
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTableState((prev) => {
          const transactions = prev.transactions ? [...prev.transactions] : []; // Check if transactions is initially empty

          transactions.push(response.data.transaction);

          return {
            ...prev,
            transactions,
          };
        });
        onOpenChange();
      }
    } catch (error) {
      toast.error("Error creating transaction!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
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
                    <DropdownItem key="rent">Rent</DropdownItem>
                    <DropdownItem key="home">Home</DropdownItem>
                    <DropdownItem key="personal">Personal</DropdownItem>
                    <DropdownItem key="travel">Travel</DropdownItem>
                    <DropdownItem key="entertainment">
                      Entertainment
                    </DropdownItem>
                    <DropdownItem key="groceries">Groceries</DropdownItem>
                    <DropdownItem key="Eating out">Eating Out</DropdownItem>
                    <DropdownItem key="other">Other</DropdownItem>
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
