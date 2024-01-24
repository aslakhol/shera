import Head from "next/head";
import NavBar from "../components/NavBar";
import { ProfileForm } from "../components/ProfileForm";
import { useSession } from "next-auth/react";
import { Toaster } from "../components/ui/sonner";

export default function ProfilePage() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <>
      <Head>
        <title>Profile | Shera</title>
        <meta name="description" content="Profile page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        {user && <ProfileForm user={user} />}
      </main>
      <Toaster />
    </>
  );
}
