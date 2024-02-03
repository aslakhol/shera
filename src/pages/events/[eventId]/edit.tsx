import Head from "next/head";
import { CreateEvent } from "../../components/event/CreateEvent";
import NavBar from "../../components/NavBar";
import { Toaster } from "../../components/ui/sonner";

export default function EditEventPage() {
  return (
    <>
      <Head>
        <title>Edit event | Shera</title>
        <meta name="description" content="Create event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        {/* Edit event */}
      </main>
      <Toaster />
    </>
  );
}
