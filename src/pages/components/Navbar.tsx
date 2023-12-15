import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/pages/components/ui/button";
import { ModeToggle } from "@/pages/components/ui/toggle-mode";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/pages/components/ui/avatar";
import { signIn, useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/pages/components/ui/dropdown-menu";

const Navbar = () => {
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
                    signIn();
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
