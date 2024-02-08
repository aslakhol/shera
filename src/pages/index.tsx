import { type NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Shera
      </h1>

      <p className="leading-7">
        Shera is a tool for managing events without being tied to a social
        network.
      </p>
      <p className="leading-7">
        Do you need to invite people to an event, but they are spread across
        multiple messaging services or social networks? Then Shera is for you.
      </p>
      <p className="leading-7">
        You can keep your attendees updated on your event on their terms. They
        decide how they get their information, without needing to create
        accounts or download an app.
      </p>
      <p className="leading-7">
        Sign in to create an event, and invite your friends to join.
      </p>
    </main>
  );
};

export default Home;
