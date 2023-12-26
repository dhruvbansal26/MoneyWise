import { selectorFamily } from "recoil";
import { tableState } from "../atoms/tableState";

export const tableTransactionsSelector = selectorFamily({
  key: "tableTransactions",

  get:
    (tableId) =>
    ({ get }) => {
      const table = get(tableState(tableId));
      return table.transactions;
    },
});
