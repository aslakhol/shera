import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { fullEventId } from "../../src/utils/event";
import { Crown, MapPin, UsersRound } from "lucide-react";
import { WorkingClock } from "../../src/components/WorkingClock";
import { formatInTimeZone } from "date-fns-tz";
import { type AttendingStatus } from "@prisma/client";

const baseUrl = process.env.BASE_URL ? `${process.env.BASE_URL}` : "";

type EventEmail = {
  event: {
    publicId: string;
    title: string;
    dateTime: Date;
    timeZone: string;
    place: string | null;
    host: { name: string | null };
    attendees: Array<{ status: AttendingStatus }>;
  };
  previewText: string;
  aboveText?: string;
  belowText?: string;
  bodyText?: string;
};

export const EventEmail = ({
  event,
  previewText,
  aboveText,
  belowText,
  bodyText,
}: EventEmail) => {
  const eventUrl = `${baseUrl}events/${fullEventId(event)}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="mt-0 px-12 pb-12 pt-5">
            <Container>
              {aboveText && <Text className="m-0 text-xl">{aboveText}</Text>}
              <Heading as="h1" className="my-0">
                {event.title}
              </Heading>
              {belowText && <Text className="m-0 text-xl">{belowText}</Text>}
            </Container>
            <InfoBox event={event} />
            <Button
              className="my-4 whitespace-nowrap rounded-md bg-[#1f1d63] px-12 py-2 text-sm font-medium text-[#fff] ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              href={eventUrl}
            >
              View event
            </Button>
            {bodyText && <Text className="pb-2 text-sm">{bodyText}</Text>}
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
              Shera.
              <br />
              <Link className=" text-xs text-[#525f7f]" href={eventUrl}>
                To unsubscribe, unattend the event.
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

type InfoBoxProps = {
  event: {
    dateTime: Date;
    timeZone: string;
    place: string | null;
    host: { name: string | null };
    attendees: Array<{ status: AttendingStatus }>;
  };
};

const InfoBox = ({ event }: InfoBoxProps) => {
  const going = event.attendees.filter((a) => a.status === "GOING").length;

  return (
    <Container className="my-4 rounded-lg border bg-[#e4e3f5] px-4 py-2 text-[#6a696f] shadow-sm">
      <Text className="m-0 flex items-center gap-2">
        <WorkingClock date={event.dateTime} size={16} />{" "}
        {formatInTimeZone(event.dateTime, event.timeZone, "H:mm")}
      </Text>
      {event.place && (
        <Text className="m-0 flex items-center gap-2">
          <Img
            className="self-center"
            src={`${baseUrl}map-pin.png`}
            width={16}
            height={16}
            color="#6a696f"
          />{" "}
          {event.place}
        </Text>
      )}
      {event.host.name && (
        <Text className="m-0 flex items-center gap-2">
          <Crown size={16} /> {event.host.name}
        </Text>
      )}
      {going > 1 && (
        <Text className="m-0 flex items-center gap-2">
          <UsersRound size={16} />{" "}
          {event.attendees.filter((a) => a.status === "GOING").length} attendees
        </Text>
      )}
    </Container>
  );
};
