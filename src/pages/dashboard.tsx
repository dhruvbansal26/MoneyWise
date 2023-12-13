import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { TableInterface } from "./interfaces";
import { TransactionInterface } from "./interfaces";
import { Card, Title, DonutChart } from "@tremor/react";
import prisma from "@/lib/prisma";
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
interface Props {
  initialTables: TableInterface[];
}

export default function Dashboard({ initialTables }: Props) {
  const { data: session, status } = useSession();
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

  const router = useRouter();

  const valueFormatter = (number: number) =>
    `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session) {
    router.push("/");
  }
  return (
    <>
      {hasTables && (
        <Card className="max-w-lg">
          <Title>Sales</Title>
          <DonutChart
            className="mt-6"
            data={chartData}
            category="amount"
            index="name"
            valueFormatter={valueFormatter}
            colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
          />
        </Card>
      )}
      {!hasTables && <p>No tables found</p>}
    </>
  );
}
