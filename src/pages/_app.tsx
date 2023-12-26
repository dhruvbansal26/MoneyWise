import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <RecoilRoot>
        <SessionProvider session={pageProps.session}>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Navbar></Navbar>
          <Component {...pageProps} />
        </SessionProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}
