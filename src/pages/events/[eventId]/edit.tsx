import EditEvent from "@/features/eventForm/components/EditEvent";
import { zStringToNumber } from "@/utils/zStringToNumber";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const EditEventPage: NextPage = () => {
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
        <title>Edit Event</title>
        <meta name="description" content="edit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EditEvent eventId={id} />
    </>
  );
};

export default EditEventPage;
