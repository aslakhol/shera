import Head from "next/head";
import { CreateEvent } from "../../components/CreateEvent";
import NavBar from "../../components/NavBar";
import { Toaster } from "../../components/ui/sonner";

export default function CreateEventPage() {
  return (
    <>
      <Head>
        <title>New event | Shera</title>
        <meta name="description" content="Create event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        <h2 className="text-2xl font-bold tracking-tight">Create an event</h2>
        <CreateEvent />
      </main>
      <Toaster />
    </>
  );
}
