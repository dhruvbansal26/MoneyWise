import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/pages/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/pages/components/ui/table";
import { TransactionForm } from "./TransactionForm";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { TableInterface } from "../interfaces";
import { tableState } from "../store/atoms/tableState";
import { toast } from "react-toastify";
import axios from "axios";
import * as React from "react";
import { Input } from "@/pages/components/ui/input";
import { Button } from "./ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";
import { tablesListState } from "../store/atoms/tablesListState";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  inputTable: TableInterface; // New prop for table ID
}

export function DataTable<TData, TValue>({
  columns,
  data,
  inputTable,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const inputTableId = inputTable.id;
  const setTableState = useSetRecoilState(tableState(inputTable.id));
  const setTablesList = useSetRecoilState(tablesListState("dev"));
  const [rowSelection, setRowSelection] = React.useState({});
  const table =
    useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onRowSelectionChange: setRowSelection,
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
        columnFilters,
        rowSelection,
      },
    }) || {};

  useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      transactions: inputTable.transactions,
    }));
  }, [inputTable.transactions]);

  async function deleteTable(id: string) {
    try {
      const response = await axios.delete(`/api/tables/${id}`);
      if (response.status === 200) {
        toast.success("Table deleted!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      setTablesList((prevTables) => {
        const filtered = prevTables.tables.filter((t) => t.id !== id);

        return {
          tables: filtered,
          length: filtered.length,
        };
      });
    } catch (error) {
      toast.success("Error deleting table!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error deleting table:", error);
    }
  }

  async function deleteTransaction(id: Number) {
    try {
      const response = await axios.delete(`/api/transactions/${id}`);

      if (response.status === 200) {
        toast.success("Transaction deleted!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTableState((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter categories..."
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      //@ts-ignore
                      onClick={() => deleteTransaction(row.original.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4 mr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteTable(inputTableId)}
          >
            <TrashIcon className="h-4 w-4 text-black-500"></TrashIcon>
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button>Add</Button>
            </DialogTrigger>
            <DialogContent className="p-4">
              <TransactionForm table={inputTable}></TransactionForm>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
