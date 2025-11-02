import Image from "next/image";
import { CTA } from "./CTA";
import { DotIcon } from "lucide-react";

import { Caprasimo } from "next/font/google";

const caprasimo = Caprasimo({ subsets: ["latin"], weight: ["400"] });

const carouselText = [
  "birthday party",
  "wedding invite",
  "baby shower",
  "graduation celebration",
  "reunion gathering",
  "halloween bash",
  "bachelor party",
  "charity event",
  "corporate meetup",
];

export const Welcome = () => {
  const renderCarouselItems = () =>
    carouselText.map((text, index) => (
      <>
        <span
          key={index}
          className="mx-2 text-lg font-medium text-primary-foreground/75"
        >
          {text}
        </span>
        <DotIcon className="mx-2 inline-block text-primary-foreground/75" />
      </>
    ));

  return (
    <main className="flex flex-grow flex-col text-primary">
      <div className="mb-8 mt-8 flex flex-col items-center gap-4 sm:mt-0">
        <Image
          src="/shera_icon.svg"
          alt="Shera Logo"
          width={125}
          height={125}
        />
        <h1
          className={`${caprasimo.className} text-7xl font-extrabold tracking-tight sm:text-9xl`}
        >
          Shera
        </h1>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-secondary-foreground">
            Something goin&apos; down?
          </span>
          <CTA />
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-12 bg-primary p-6 text-primary-foreground/90 lg:flex-row lg:gap-4">
        <div className="flex w-full flex-col items-center gap-6 px-4 lg:w-1/2">
          <h2
            className={`${caprasimo.className} mt-6 text-center text-5xl font-semibold tracking-tight sm:text-6xl`}
          >
            Skjer &apos;a?
          </h2>

          <div className="flex flex-col gap-4 text-lg lg:max-w-[600px]">
            <p className="leading-7">
              What&apos;s up? If you need to connect the people you love to your
              new and awesome event, you&apos;ve come to the right place. Shera
              is tool for just that, and it&apos;s quick, fast and easy!
            </p>
            <p className="leading-7">
              Are your friends and family all spread across multiple messaging
              services or social networks? Shera makes sure they all get their
              invites and stay in the loop. Invitees don&apos;t even need to
              sign up! Who needs all that extra noise?
            </p>
            <p className="leading-7">
              Go ahead and create an event, then let the excitement begin.
            </p>
          </div>
        </div>

        <div className="hidden h-[80%] self-center rounded-md border-2 border-primary-foreground/90 lg:block" />

        <div className="flex w-full flex-col items-center gap-6 px-4 lg:w-1/2">
          <h2
            className={`${caprasimo.className} mt-6 text-center text-5xl font-semibold tracking-tight sm:text-6xl`}
          >
            Share a...
          </h2>

          <div className="relative flex h-[2rem] w-[80%] max-w-[550px] overflow-x-hidden">
            <div className="absolute animate-marquee whitespace-nowrap">
              {renderCarouselItems()}
            </div>
            <div className="absolute top-0 animate-marquee-loop whitespace-nowrap">
              {renderCarouselItems()}
            </div>

            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-primary to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-primary to-transparent" />
          </div>

          <div className="flex max-h-[500px] w-full max-w-[300px] justify-center gap-4">
            <Image
              alt="Image showing the event list page"
              src="/images/promo.png"
              width={1006}
              height={912}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
