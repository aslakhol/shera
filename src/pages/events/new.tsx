import NewEvent from "@/features/newEvent/components/NewEvent";
import { NextPage } from "next";
import Head from "next/head";

const NewEventPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>New event</title>
        <meta name="description" content="Page for creating new events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NewEvent />
    </>
  );
};

export default NewEventPage;
