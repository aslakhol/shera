import Head from "next/head";
import { CreateEvent } from "../../components/event/CreateEvent";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { MainLayout } from "../../components/Layout";

const CreateEventPage: NextPageWithLayout = () => {
  return (
    <main className="flex flex-grow flex-col items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        Create an event
      </h2>
      <CreateEvent />
    </main>
  );
};

CreateEventPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>New event | Shera</title>
        <meta name="description" content="Create event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default CreateEventPage;
