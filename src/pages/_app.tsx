import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Analytics } from "@vercel/analytics/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { MainLayout } from "../components/Layout";
import Head from "next/head";
import { env } from "../env";

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

  if (typeof window !== "undefined") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      loaded: (posthog) => {
        if (env.NODE_ENV === "development") posthog.debug(); // debug mode in development
      },
    });
  }

  return (
    <SessionProvider session={session}>
      <Analytics />
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
