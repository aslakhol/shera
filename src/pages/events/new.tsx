import Footer from "@/features/footer/compontents/Footer";
import NewEvent from "@/features/newEvent/components/NewEvent";
import { NextPage } from "next";
import Head from "next/head";

const NewEventPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>New event</title>
        <meta name="description" content="Page for creating new events" />
      </Head>

      <NewEvent />
      <Footer />
    </>
  );
};

export default NewEventPage;
