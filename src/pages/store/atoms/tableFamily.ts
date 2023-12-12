import { TransactionInterface } from "@/pages/interfaces";
import { atomFamily } from "recoil";

// Define an atom family with a unique identifier
export const tableFamily = atomFamily({
  key: "itemState",
  default: {
    id: "",
    transactions: [] as TransactionInterface[],
  }, // Set your default value here
});
