import Head from "next/head";
import { useRouter } from "next/router";
import { EditEvent } from "../../../components/event/EditEvent";
import { type NextPageWithLayout } from "../../_app";
import { type ReactElement } from "react";
import { MainLayout } from "../../../components/Layout";

const EditEventPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const fullEventId = query.fullEventId;

  if (typeof fullEventId !== "string") {
    return <div>Event not found</div>;
  }

  const publicId = fullEventId.split("-").at(-1);

  if (publicId) {
    return <div>Event not found</div>;
  }

  return (
    <main className="flex flex-grow flex-col items-center">
      <EditEvent publicId={publicId} />
    </main>
  );
};

EditEventPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Edit event | Shera</title>
        <meta name="description" content="Create event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default EditEventPage;
