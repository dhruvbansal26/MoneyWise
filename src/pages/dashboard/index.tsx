"use client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import Router from "next/router";
import { useSetRecoilState } from "recoil";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/userState";
interface DashboardProps {
  userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      Router.push(`/dashboard/${userId}`);
    }
  }, [userId]);

  return (
    <>
      <p>Redirecting..</p>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  //@ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { userId },
  };
}
