import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";

export default function Home() {
  <>hello</>;
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
