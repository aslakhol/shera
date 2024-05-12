import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { fullEventId } from "../src/utils/event";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const imgUrl = baseUrl
  ? `${baseUrl}/favicon.ico`
  : `${baseUrl}/static/favicon.ico`;

type EventTomorrowProps = {
  event: { title: string; dateTime: Date; publicId: string };
};

export const EventTomorrow = ({ event }: EventTomorrowProps) => {
  console.log(imgUrl, "imgUrl");
  return (
    <Html>
      <Head />
      <Preview>{event.title} starting tomorrow</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="mx-auto mt-0 px-0 pb-12 pt-5">
            <Section className="px-12">
              <Text className="text-xl font-semibold">
                {event.title} starting tomorrow
              </Text>
              <Text className="text-[#525f7f]">
                Head over to Shera to see the event details. If you'd rather not
                receive any future emails from this event you can unattend on
                event page.
              </Text>
              <Section className="flex w-full justify-center">
                <Button
                  className="whitespace-nowrap rounded-md bg-[#1f1d63] px-12 py-2 text-sm font-medium text-[#fff] ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  href={`${baseUrl}/events/${fullEventId(event)}`}
                >
                  See event
                </Button>
              </Section>
              <Hr className="mx-0 my-5 w-full border border-solid border-[#e6ebf1]" />
              <Img src={imgUrl} width="35" height="35" alt="Shera logo" />
              <Text className="text-sm text-[#8898aa]">
                Host your next event with{" "}
                <Link
                  className="text-[#8898aa] underline"
                  href={`${baseUrl}/events/new`}
                >
                  Shera
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EventTomorrow;

EventTomorrow.PreviewProps = {
  event: {
    title: "4 Pils og en pizza",
    dateTime: new Date(),
    publicId: "inr40by0",
  },
} as EventTomorrowProps;
