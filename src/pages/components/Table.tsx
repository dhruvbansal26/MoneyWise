import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { TableInterface } from "@/pages/interfaces";

export default function Table() {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [currentYear, setCurrentYear] = useState<number>(0);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth());
    const month = currentDate.toLocaleString("en-EN", { month: "long" });
    setCurrentMonth(month);
    const year = currentDate.getFullYear();
    setCurrentYear(year);
  }, []);

  return (
    <table className="table-auto border-collapse">
      <thead>
        <tr>
          <th className="border py-2 px-4">
            {currentMonth} {currentYear}
          </th>
        </tr>
        <tr>
          <th className="border px-4 py-2">Title</th>
          <th className="border px-4 py-2">Description</th>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">Paycheck</td>
          <td className="border px-4 py-2">Bi-weekly pay</td>
          <td className="border px-4 py-2">11/15/2023</td>
          <td className="border px-4 py-2">$2,000</td>
        </tr>
        <tr>
          <td className="border px-4 py-2">Rent</td>
          <td className="border px-4 py-2">Monthly rent payment</td>
          <td className="border px-4 py-2">11/5/2023</td>
          <td className="border px-4 py-2">$1,200</td>
        </tr>
      </tbody>
    </table>
  );
}
