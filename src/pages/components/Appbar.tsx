import { useRouter } from "next/router";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Appbar() {
  const session = useSession();

  if (!session.data) {
    return (
      <>
        <h1 style={{ color: "black" }}>My App</h1>
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={() => {
            signIn();
          }}
        >
          Sign up
        </button>
      </>
    );
  } else {
    return (
      <>
        <img
          src={session.data.user?.image || ""}
          alt="Profile"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />

        <h1 style={{ color: "black", alignContent: "center" }}>
          {session.data.user?.email}
        </h1>
        <h1 style={{ color: "black", alignContent: "center" }}>
          {session.data.user?.name}
        </h1>

        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </button>
      </>
    );
  }
}
export default Appbar;
