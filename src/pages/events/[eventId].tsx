import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Event from "../../features/event/components/Event";

const EventPage: NextPage = () => {
  const { eventId } = useRouter().query;

  if (!eventId || Array.isArray(eventId)) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Event</title>
        <meta name="description" content="Page for an event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Event eventId={eventId} />
    </>
  );
};

export default EventPage;
