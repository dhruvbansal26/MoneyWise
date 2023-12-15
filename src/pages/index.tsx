import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-5xl font-bold">MoneyWise</h1>
      <p className="text-xl text-muted-foreground">
        Latest way to track your expenses.
      </p>
    </main>
  );
}
