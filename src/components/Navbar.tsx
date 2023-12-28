import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/toggle-mode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, useSession, signOut, getProviders } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import Signin from "@/pages/auth/signin";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

const Navbar = ({ providers }) => {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <header>
        <nav>
          <ul className="flex items-center justify-between">
            <li className="flex flex-row">
              <Link className="gap-2 p-6" href="/">
                <h1 className="text-2xl font-bold leading-7">MoneyWise</h1>
              </Link>
            </li>
            <div className="ml-auto flex flex-row gap-2 mr-5">
              <li>
                <ModeToggle></ModeToggle>
              </li>
              <li>
                <Button
                  onClick={() => {
                    Signin(providers);
                  }}
                >
                  Login
                </Button>
              </li>
            </div>
          </ul>
        </nav>
      </header>
    );
  } else {
    return (
      <>
        <header className="sticky w-full">
          <nav>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            ></div>
            <ul className="flex items-center justify-between">
              <li className="flex flex-row ">
                <Link className="gap-2 p-6" href="/">
                  <h1 className="text-2xl font-bold leading-7">MoneyWise</h1>
                </Link>
              </li>
              <div className="ml-auto flex flex-row gap-2 mr-5">
                <li>
                  <ModeToggle></ModeToggle>
                </li>
                <li>
                  <Button>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </li>
                <li>
                  <Button>
                    <Link href="/tracker">Tracker</Link>
                  </Button>
                </li>
                <li className="pl-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback>NA</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="m-4 mt-0">
                      <div className="p-0">
                        <DropdownMenuLabel>
                          {session?.user?.name}
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="text-xs font-light">
                          {session?.user?.email}
                        </DropdownMenuLabel>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </div>
            </ul>
          </nav>
        </header>
      </>
    );
  }
};

export default Navbar;
