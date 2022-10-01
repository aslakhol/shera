import EditEvent from "@/features/editEvent/components/EditEvent";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const EditEventPage: NextPage = () => {
  const { eventId } = useRouter().query;

  if (!eventId || Array.isArray(eventId)) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Edit Event</title>
        <meta name="description" content="edit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EditEvent eventId={eventId} />
    </>
  );
};

export default EditEventPage;
