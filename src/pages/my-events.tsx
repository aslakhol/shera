import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import MyEvents from "../features/myEvents/MyEvents";

const MyEventsPage: NextPage = () => {
  const { data: session } = useSession();

  if (!session?.user.email) {
    return <>Could not find email on your user.</>;
  }

  return (
    <>
      <Head>
        <title>MyEvents</title>
        <meta name="description" content="My Events" />
      </Head>

      <MyEvents email={session.user.email} />
    </>
  );
};

export default MyEventsPage;
