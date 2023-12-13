import { signIn, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

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

export default function Appbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!session) {
    return (
      <Navbar className="bg-gray w-[relative] h-[84px] overflow-hidden text-left text-base text-white font-inter">
        <NavbarBrand>
          <p className="font-bold text-inherit text-left">MoneyWise</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              variant="flat"
              onClick={() => {
                signIn();
              }}
            >
              Login
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  } else {
    return (
      <Navbar className="bg-gray w-[relative] h-[84px] overflow-true text-left text-base text-white font-inter">
        <NavbarBrand>
          <p className="font-bold text-inherit">MoneyWise</p>
        </NavbarBrand>
        <NavbarItem isActive>
          <Button as={Link} href="/dashboard" aria-current="page">
            Dashboard
          </Button>
        </NavbarItem>
        <NavbarItem isActive>
          <Button as={Link} href="/tracker" aria-current="page">
            Tracker
          </Button>
        </NavbarItem>

        <NavbarItem>
          <button
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            onClick={handleDropdownToggle}
            className="btn-lg"
          >
            <img
              className="h-8 w-8 rounded-full"
              src={session?.user?.image || ""}
              alt=""
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <Button onClick={() => signOut()} className=" text-gray-700 ">
                Sign out
              </Button>
            </div>
          )}
        </NavbarItem>
      </Navbar>
    );
  }
}
