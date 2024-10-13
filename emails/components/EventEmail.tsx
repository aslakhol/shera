import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { fullEventId } from "../../src/utils/event";
import { formatInTimeZone } from "date-fns-tz";
import { type AttendingStatus } from "@prisma/client";
import { EmailClock } from "./EmailClock";

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
  body?: React.ReactNode;
};

export const EventEmail = ({
  event,
  previewText,
  aboveText,
  belowText,
  bodyText,
  body,
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
            {body && body}
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
      <Row width={"fit-content"} align="left">
        <Column className="pr-2">
          <EmailClock
            date={event.dateTime}
            size={16}
            timeZone={event.timeZone}
          />
        </Column>
        <Column>
          <Text className="m-0">
            {formatInTimeZone(event.dateTime, event.timeZone, "H:mm")}
          </Text>
        </Column>
      </Row>
      <Row>
        <Column></Column>
      </Row>
      {event.place && (
        <Row width={"fit-content"} align="left">
          <Column className="pr-2">
            <Img src={`${baseUrl}/email/map-pin.png`} width={16} height={16} />
          </Column>
          <Column>
            <Text className="m-0">{event.place}</Text>
          </Column>
        </Row>
      )}
      <Row>
        <Column></Column>
      </Row>
      {event.host.name && (
        <Row width={"fit-content"} align="left">
          <Column className="pr-2">
            <Img src={`${baseUrl}/email/crown.png`} width={16} height={16} />
          </Column>
          <Column>
            <Text className="m-0">{event.host.name}</Text>
          </Column>
        </Row>
      )}
      <Row>
        <Column></Column>
      </Row>
      {going > 1 && (
        <Row width={"fit-content"} align="left">
          <Column className="pr-2">
            <Img
              src={`${baseUrl}/email/user-round.png`}
              width={16}
              height={16}
            />
          </Column>
          <Column>
            <Text className="m-0">
              {event.attendees.filter((a) => a.status === "GOING").length}{" "}
              attendees
            </Text>
          </Column>
        </Row>
      )}
    </Container>
  );
};
