import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Event from "@/features/event/components/Event";
import Footer from "@/features/footer/compontents/Footer";

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
      </Head>

      <Event eventId={eventId} />
      <Footer />
    </>
  );
};

export default EventPage;
