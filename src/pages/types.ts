import { z } from "zod";

export const TransactionSchema = z.object({
  tableId: z.string(),
  title: z.string().min(2),
  amount: z.number().safe(),
  description: z.string().min(2),
  selectedValue: z.string().min(2),
  split: z.boolean(),
  splitcount: z.number().max(100),
});

export type Signup = z.infer<typeof TransactionSchema>;
