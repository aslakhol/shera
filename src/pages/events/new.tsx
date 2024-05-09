import Head from "next/head";
import { CreateEvent } from "../../components/event/CreateEvent";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { MainLayout } from "../../components/Layout";

const CreateEventPage: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        Create an event
      </h2>
      <CreateEvent />
    </div>
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
