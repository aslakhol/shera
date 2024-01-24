import Head from "next/head";
import NavBar from "../../components/NavBar";
import { Toaster } from "../../components/ui/sonner";
import { Event } from "../../components/event/Event";

export default function EventPage() {
  return (
    <>
      <Head>
        <title>Event | Shera</title>
        <meta name="description" content="Event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        <Event />
      </main>
      <Toaster />
    </>
  );
}
