import Head from "next/head";
import { Event } from "../../../components/event/Event";
import { useRouter } from "next/router";
import { type NextPageWithLayout } from "../../_app";
import { type ReactElement } from "react";
import { MainLayout } from "../../../components/Layout";

const EventPage: NextPageWithLayout = () => {
  const { query } = useRouter();

  if (!query.eventId || !Number(query.eventId)) {
    return <div>Event not found</div>;
  }

  return (
    <main className="flex flex-grow flex-col items-center">
      <Event eventId={Number(query.eventId)} />
    </main>
  );
};

EventPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Event | Shera</title>
        <meta name="description" content="Event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default EventPage;
