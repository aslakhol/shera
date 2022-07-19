import EditEvent from "@/features/editEvent/components/EditEvent";
import { NextPage } from "next";
import Head from "next/head";

const EditEventPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>EditEvent</title>
        <meta name="description" content="edit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EditEvent />
    </>
  );
};

export default EditEventPage;
