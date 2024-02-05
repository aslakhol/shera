import Head from "next/head";
import NavBar from "../../../components/NavBar";
import { Toaster } from "../../../components/ui/sonner";
import { Event } from "../../../components/event/Event";
import { useRouter } from "next/router";

export default function EventPage() {
  const { query } = useRouter();

  if (!query.eventId || !Number(query.eventId)) {
    return <div>Event not found</div>;
  }

  return (
    <>
      <Head>
        <title>Event | Shera</title>
        <meta name="description" content="Event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        <Event eventId={Number(query.eventId)} />
      </main>
      <Toaster />
    </>
  );
}
