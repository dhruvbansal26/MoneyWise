export interface TableInterface {
  id: string;
  userId: string;
  month: number;
  year: number;
  transactions: TransactionInterface[];
}

export interface TransactionInterface {
  id: number;
  tableId: string;
  amount: number;
  title: string;
  description: string;
  split?: boolean;
  splitcount?: number;
  category: string;
}
