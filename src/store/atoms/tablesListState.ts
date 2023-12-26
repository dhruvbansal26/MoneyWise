import { atomFamily } from "recoil";
import { TableInterface } from "@/interfaces";
interface TablesState {
  tables: TableInterface[];
  length: number;
}

export const tablesListState = atomFamily<TablesState, string>({
  key: "tablesList",
  default: {
    tables: [],
    length: 0,
  },
});
