import Head from "next/head";
import NavBar from "../../components/NavBar";
import { Toaster } from "../../components/ui/sonner";
import { MyEvents } from "../../components/myEvents/MyEvents";
import { useSession } from "next-auth/react";

export default function EventsPage() {
  const { data: session } = useSession();

  if (!session?.user.email) {
    return <>Could not find email on your user.</>;
  }

  return (
    <>
      <Head>
        <title>Events | Shera</title>
        <meta name="description" content="Create event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        <MyEvents email={session.user.email} />
      </main>
      <Toaster />
    </>
  );
}
