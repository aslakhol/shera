import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Shera</title>
        <meta name="description" content="Welcome page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen mx-auto pt-2 w-8/12 md:w-1/2 prose">
        <h1 className="font-extrabold text-7xl">Shera</h1>

        <p>
          Shera is a tool for managing events without being tied to one social
          network.
        </p>
        <p>
          Do you need to invite people to an event, but they are spread across
          multiple messaging services or social networks? Then Shera is for you.
        </p>
        <p>
          You can keep your attendees updated on your event on their terms. They
          decide how they get their information, without needing to create
          accounts or download an app.
        </p>
        <p>Log in to create an event, and invite your friends to join.</p>

        <Link href={"/events/new"}>
          <button className="btn">Create event</button>
        </Link>
      </div>
    </>
  );
};

export default Home;
