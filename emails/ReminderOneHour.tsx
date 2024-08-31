import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { fullEventId } from "../src/utils/event";
import { Crown, MapPin, UsersRound } from "lucide-react";
import { format } from "date-fns";
import { WorkingClock } from "../src/components/WorkingClock";

const baseUrl = process.env.BASE_URL ? `${process.env.BASE_URL}` : "";

type ReminderOneHourProps = {
  event: { title: string; dateTime: Date; publicId: string };
};

export const ReminderOneHour = ({ event }: ReminderOneHourProps) => {
  return (
    <Html>
      <Head />
      <Preview>{event.title} is starting in 1 hour</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="mt-0 px-12 pb-12 pt-5">
            <Container>
              <Heading as="h1" className="mb-0">
                {event.title}
              </Heading>
              <Text className="m-0 text-xl">Is starting in 1 hour</Text>
            </Container>
            <Container
              id="infobox"
              className=" my-4 rounded-lg border bg-[#e4e3f5] px-4 py-2 text-[#6a696f] shadow-sm"
            >
              <Text className="m-0 flex items-center gap-2">
                <WorkingClock date={event.dateTime} size={16} />{" "}
                {format(event.dateTime, "H:mm")}
              </Text>
              {true && (
                <Text className="m-0 flex items-center gap-2">
                  <MapPin size={16} /> Sofaen
                </Text>
              )}
              <Text className="m-0 flex items-center gap-2">
                <Crown size={16} /> {"Aslak"}
              </Text>
              <Text className="m-0 flex items-center gap-2">
                <UsersRound size={16} /> 2 attendees
              </Text>
            </Container>
            <Button
              className="my-4 whitespace-nowrap rounded-md bg-[#1f1d63] px-12 py-2 text-sm font-medium text-[#fff] ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              href={`${baseUrl}events/${fullEventId(event)}`}
            >
              View event
            </Button>
            <Hr className="mx-0 mb-5 mt-0 w-full border border-solid border-[#e6ebf1]" />
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
            <div className="py-3" />
            <Text className="text-xs text-[#525f7f]">
              You received this email because you are attending {event.title} on
              Shera. To unsubscribe unattend the event.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ReminderOneHour;

ReminderOneHour.PreviewProps = {
  event: {
    title: "4 Pils og en pizza",
    dateTime: new Date(),
    publicId: "inr40by0",
  },
} as ReminderOneHourProps;
