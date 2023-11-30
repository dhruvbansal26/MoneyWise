export interface TableInterface {
  id: number;
  userId: string;
  month: number;
  year: number;
  transactions: TransactionInterface[];
}

export interface TransactionInterface {
  id: number;
  tableId: number;
  amount: number;
  description: string;
}
