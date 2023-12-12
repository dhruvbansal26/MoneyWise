import { atom } from "recoil";
import { TableInterface, TransactionInterface } from "@/pages/interfaces";

interface TableState {
  id: string;
  transactions: TransactionInterface[];
}

export const tableState = atom<TableState>({
  key: "tableState",
  default: {
    id: "",
  },
});
