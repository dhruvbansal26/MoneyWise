import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";

export default function Home() {
  return <div>Hello</div>;
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      props: {},
    };
  }
  return {
    props: {
      session,
    },
  };
}
