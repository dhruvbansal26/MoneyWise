import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Appbar from "../pages/components/Appbar";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SessionProvider session={pageProps.session}>
        <Appbar></Appbar>
        <Component {...pageProps} />;
      </SessionProvider>
    </RecoilRoot>
  );
}
