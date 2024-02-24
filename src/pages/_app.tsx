import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { MainLayout } from "../components/Layout";
import Head from "next/head";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? getDefaultLayout;

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

const getDefaultLayout = (page: ReactElement) => (
  <>
    <Head>
      <title>Shera</title>
      <meta name="description" content="Shera - Where great events take off" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <MainLayout>{page}</MainLayout>
  </>
);
