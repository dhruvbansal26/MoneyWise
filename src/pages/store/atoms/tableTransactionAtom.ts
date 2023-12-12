import { TransactionInterface } from "@/pages/interfaces";
import { atom } from "recoil";

export const tableTransactionAtom = atom({
  key: "tableTransactions",
  default: [] as TransactionInterface[],
});
