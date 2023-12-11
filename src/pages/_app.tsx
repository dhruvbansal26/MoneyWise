import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Appbar from "../pages/components/Appbar";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <NextUIProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <SessionProvider session={pageProps.session}>
          <Appbar></Appbar>
          <Component {...pageProps} />
        </SessionProvider>
      </NextUIProvider>
    </RecoilRoot>
  );
}
