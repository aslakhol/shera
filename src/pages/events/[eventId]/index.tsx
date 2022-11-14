import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Event from "@/features/event/components/Event";
import { zStringToNumber } from "@/utils/zStringToNumber";

const EventPage: NextPage = () => {
  const { eventId } = useRouter().query;

  if (!eventId) {
    return <div>Event not found</div>;
  }

  const id = zStringToNumber.parse(eventId);

  if (!id) {
    return <div>Event not found</div>;
  }

  return (
    <>
      <Head>
        <title>Event</title>
        <meta name="description" content="Page for an event" />
      </Head>

      <Event eventId={id} />
    </>
  );
};

export default EventPage;
