import Head from "next/head";
import { Event } from "../../../components/event/Event";
import { useRouter } from "next/router";
import { type NextPageWithLayout } from "../../_app";
import { type ReactElement } from "react";
import { MainLayout } from "../../../components/Layout";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import superjson from "superjson";
import { type GetStaticPaths, type GetStaticProps } from "next";
import { db } from "../../../server/db";
import { addDays } from "date-fns";

const EventPage: NextPageWithLayout = () => {
  const { query } = useRouter();

  if (!query.eventId || !Number(query.eventId)) {
    return <div>Event not found</div>;
  }

  return (
    <main className="flex flex-grow flex-col items-center">
      <Event eventId={Number(query.eventId)} />
    </main>
  );
};

EventPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Event | Shera</title>
        <meta name="description" content="Event page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default EventPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const eventsAfter7DaysAgo = await db.event.findMany({
    where: { dateTime: { gte: addDays(new Date(), -7) } },
    select: { eventId: true },
  });
  const allEvents = await db.event.findMany({
    select: { eventId: true },
  });
  const eventsToRender =
    allEvents.length > 200 ? eventsAfter7DaysAgo : allEvents;

  return {
    paths: eventsToRender.map((event) => ({
      params: { eventId: event.eventId.toString() },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null, res: null }),
    transformer: superjson,
  });

  await helpers.events.event.prefetch({
    eventId: Number(context.params?.eventId),
  });
  await helpers.events.attendees.prefetch({
    eventId: Number(context.params?.eventId),
  });
  await helpers.posts.posts.prefetch({
    eventId: Number(context.params?.eventId),
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
    revalidate: 60,
  };
};
