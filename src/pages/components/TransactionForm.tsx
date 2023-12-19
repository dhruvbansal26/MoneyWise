"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/pages/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Checkbox } from "./ui/checkbox";
import { Input } from "@/pages/components/ui/input";
import { useRecoilState } from "recoil";
import { tableFamily } from "../store/atoms/tableFamily";
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

  const [tableState, setTableState] = useRecoilState(tableFamily(table.id));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.parse(values); // Use Zod's parse function
    const { title, description, amount, category, split, splitcount } =
      parsedValues;
    console.log("these are the values submitted: ", parsedValues);
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
        setTableState((prev) => {
          const transactions = prev.transactions ? [...prev.transactions] : []; // Check if transactions is initially empty

          transactions.push(response.data.transaction);

          return {
            ...prev,
            transactions,
          };
        });
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Card className=" w-[480px] border-none">
        <CardHeader>
          <CardTitle>New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="split"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-2">
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
                        <FormItem className="w-12rem border-b border-gray-500">
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
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
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
    </div>
  );
}
