import { TransactionInterface } from "@/pages/interfaces";
import { atomFamily } from "recoil";

export const tableState = atomFamily({
  key: "tableState",
  default: {
    id: "",
    transactions: [] as TransactionInterface[],
  },
});
