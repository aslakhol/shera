import Head from "next/head";
import { MyEvents } from "../../components/myEvents/MyEvents";
import { useSession } from "next-auth/react";
import { type NextPageWithLayout } from "../_app";
import { MainLayout } from "../../components/Layout";
import { type ReactElement } from "react";

const EventsPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  if (!session?.user.email) {
    return <>Could not find email on your user.</>;
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <MyEvents email={session.user.email} />
      </main>
    </>
  );
};

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Events | Shera</title>
        <meta name="description" content="Create event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default EventsPage;
