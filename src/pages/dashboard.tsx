import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { TableInterface } from "./interfaces";
import { Card, Title, DonutChart } from "@tremor/react";
import prisma from "@/lib/prisma";
interface Props {
  initialTables: TableInterface[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      props: {},
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email || "",
    },
  });

  const tables = await prisma.transactionTable.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      transactions: true,
    },
  });
  return {
    props: {
      session,
      initialTables: tables,
    },
  };
}

export default function Dashboard({ initialTables }: Props) {
  const hasTables = initialTables && initialTables.length > 0;
  const transactions = hasTables ? initialTables[0].transactions : [];

  const groupedTransactions = transactions.reduce((acc: any, t) => {
    if (!acc[t.category]) {
      acc[t.category] = {
        name: t.category,
        amount: 0,
      };
    }

    acc[t.category].amount += t.amount;

    return acc;
  }, {});

  const chartData = Object.values(groupedTransactions).map((item: any) => ({
    name: item.name,
    amount: item.amount,
  }));

  const valueFormatter = (number: number) =>
    `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

  return (
    <>
      <div className="flex flex-col items-center pt-14">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Visualize your expenses and never spend more!
        </p>
        {hasTables ? (
          <>
            <Card className="max-w-lg mt-10">
              <Title>Spending</Title>
              <DonutChart
                className="mt-6"
                data={chartData}
                category="amount"
                index="name"
                valueFormatter={valueFormatter}
                colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
              />
            </Card>
          </>
        ) : (
          <p className="mt-16 text-muted-foreground">No tables found.</p>
        )}
      </div>
    </>
  );
}
