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
import { fullEventId } from "../../../utils/event";

const EventPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const fullEventId = query.fullEventId;

  if (typeof fullEventId !== "string") {
    return <div>Event not found</div>;
  }

  const publicId = fullEventId.split("-").at(-1);

  if (!publicId) {
    return <div>Event not found</div>;
  }

  return <Event publicId={publicId} />;
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
    select: { publicId: true, title: true },
  });
  const allEvents = await db.event.findMany({
    select: { publicId: true, title: true },
  });
  const eventsToRender =
    allEvents.length > 200 ? eventsAfter7DaysAgo : allEvents;

  return {
    paths: eventsToRender.map((event) => ({
      params: { fullEventId: fullEventId(event) },
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

  const fullEventId =
    typeof context.params?.fullEventId === "string"
      ? context.params.fullEventId
      : "";
  const publicId = fullEventId.split("-").at(-1)!;

  await helpers.events.event.prefetch({
    publicId,
  });
  await helpers.events.attendees.prefetch({
    publicId,
  });
  await helpers.posts.posts.prefetch({
    publicId,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
    revalidate: 60,
  };
};
