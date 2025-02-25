import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Analytics } from "@vercel/analytics/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { MainLayout } from "../components/Layout";
import Head from "next/head";
import { env } from "../env";
import { Router } from "next/router";

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

  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
    });

    const handleRouteChange = () => posthog?.capture("$pageview");

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <SessionProvider session={session}>
        <Analytics />
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </PostHogProvider>
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
