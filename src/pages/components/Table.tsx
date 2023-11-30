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
    <div className="p-20">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg shadow overflow-hidden dark:border-gray-700 dark:shadow-gray-900">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white"
                    >
                      TITLE
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white"
                    >
                      DESCRIPTION
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white"
                    >
                      AMOUNT
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white"
                    >
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-800 dark:text-black-200">
                      John Brown
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800 dark:text-black-200">
                      New York No. 1 Lake Park
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800 dark:text-black-200">
                      45
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
