import { signIn, useSession, signOut } from "next-auth/react";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

function Appbar() {
  const session = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!session.data) {
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
              src={session.data?.user?.image || ""}
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
export default Appbar;
