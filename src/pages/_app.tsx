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
      <SessionProvider session={pageProps.session}>
        <NextUIProvider>
          <ToastContainer
            position="top-center"
            autoClose={1500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Appbar></Appbar>
          <Component {...pageProps} />
        </NextUIProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}
