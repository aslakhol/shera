import { CTA } from "./CTA";

export const Welcome = () => {
  return (
    <>
      <main className="flex flex-grow flex-col items-center justify-center text-primary">
        <div className="flex max-w-lg flex-col gap-8">
          <h1 className=" scroll-m-20  text-8xl font-extrabold tracking-tight ">
            Shera
          </h1>

          <div className="flex flex-col gap-4">
            <p className="leading-7">
              Shera is a tool for managing events without being tied to a social
              network.
            </p>
            <p className="leading-7">
              Do you need to invite people to an event, but they are spread
              across multiple messaging services or social networks? Then Shera
              is for you.
            </p>

            <p className="leading-7">
              Sign in to create an event, and invite your friends to join.
            </p>
          </div>
          <CTA />
        </div>
      </main>
    </>
  );
};
