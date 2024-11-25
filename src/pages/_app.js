import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Provider>
        <Navbar />
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
