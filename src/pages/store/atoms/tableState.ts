import { TransactionInterface } from "@/pages/interfaces";
import { atom } from "recoil";

export const tableState = atom({
  key: "tableState",
  default: {
    id: "",
    transactions: [] as TransactionInterface[],
  },
});
