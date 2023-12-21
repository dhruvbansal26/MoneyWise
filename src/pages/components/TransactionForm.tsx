import { zodResolver } from "@hookform/resolvers/zod";
import { tablesListState } from "../store/atoms/tablesListState";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/pages/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/pages/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/pages/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/pages/components/ui/select";
import { tableState } from "../store/atoms/tableState";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { Checkbox } from "./ui/checkbox";
import { Input } from "@/pages/components/ui/input";
import axios from "axios";
import { TableInterface } from "../interfaces";
const formSchema = z.object({
  amount: z.number().max(100000, {
    message: "Smaller amount expected.",
  }),
  title: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Please pick one.",
  }),
  split: z.boolean().default(false).optional(),
  splitcount: z
    .number()
    .max(50, {
      message: "Number of splits must be smaller.",
    })
    .optional(),
});
interface Props {
  table: TableInterface;
}

export function TransactionForm({ table }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      title: "",
      description: "",
      category: "",
      split: false,
      splitcount: 0,
    },
  });

  const setTableState = useSetRecoilState(tableState(table.id));
  const setTablesList = useSetRecoilState(tablesListState("dev"));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.parse(values); // Use Zod's parse function
    const { title, description, amount, category, split, splitcount } =
      parsedValues;
    const tableId = table.id;
    try {
      const response = await axios.post("/api/transactions", {
        tableId,
        title,
        amount,
        description,
        category,
        split,
        splitcount,
      });

      if (response.status === 200) {
        toast.success("Transaction added!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        let updatedTransactions: any;

        setTableState((prev) => {
          // update transactions for this table

          updatedTransactions = [
            ...prev.transactions,
            response.data.transaction,
          ];

          return {
            ...prev,
            transactions: updatedTransactions,
          };
        });

        setTablesList((prev) => {
          // update tables list

          const updatedTables = prev.tables.map((table) => {
            if (table.id === tableId) {
              return { ...table, transactions: updatedTransactions };
            } else {
              return table;
            }
          });

          return {
            ...prev,
            tables: updatedTables,
          };
        });
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent className="border-none outline-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="split"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0 p-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-3"
                    />
                  </FormControl>
                  <div className="pt-3 leading-none">
                    <FormLabel>Split it?</FormLabel>
                  </div>
                  <FormField
                    control={form.control}
                    name="splitcount"
                    render={({ field }) => (
                      <FormItem className=" w-[50px] border-b border-gray-500">
                        <FormControl>
                          <Input
                            placeholder="Count"
                            {...field}
                            className="appearance-none bg-transparent border-none leading-tight focus:border-none"
                            type="number"
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amount"
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your transaction amount.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormDescription>Name the transaction.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Description for the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Pick" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Groceries">Groceries</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Choose a category.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
