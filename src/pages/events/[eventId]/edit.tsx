import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "sonner";
import NavBar from "../../../components/NavBar";
import { EditEvent } from "../../../components/event/EditEvent";

export default function EditEventPage() {
  const { query } = useRouter();

  if (!query.eventId || !Number(query.eventId)) {
    return <div>Event not found</div>;
  }
  return (
    <>
      <Head>
        <title>Edit event | Shera</title>
        <meta name="description" content="Create event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        <EditEvent eventId={Number(query.eventId)} />
      </main>
      <Toaster />
    </>
  );
}
