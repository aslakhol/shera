import {
  Body,
  Button,
  Container,
  Head,
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

const baseUrl = process.env.BASE_URL ? `${process.env.BASE_URL}` : "";

type InviteProps = {
  event: {
    title: string;
    dateTime: Date;
    publicId: string;
  };
  inviterName?: string;
};

export const Invite = ({ event, inviterName }: InviteProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        {inviterName
          ? `${inviterName} has invited you to ${event.title}!`
          : `You've been invited to ${event.title}!`}
      </Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="mx-auto mt-0 px-0 pb-12 pt-5">
            <Section className="px-12">
              <Text className="text-xl font-semibold">
                {inviterName
                  ? `${inviterName} has invited you to ${event.title}!`
                  : `You've been invited to ${event.title}!`}{" "}
              </Text>
              <Text className="text-[#525f7f]">
                Head over to Shera to see the event details.
              </Text>
              <Section className="flex w-full justify-center">
                <Button
                  className="whitespace-nowrap rounded-md bg-[#1f1d63] px-12 py-2 text-sm font-medium text-[#fff] ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  href={`${baseUrl}/events/${fullEventId(event)}`}
                >
                  See event
                </Button>
              </Section>
              <Text className="text-[#525f7f]">
                Unattend the event to opt out of future emails.
              </Text>
              <Hr className="mx-0 my-5 w-full border border-solid border-[#e6ebf1]" />
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

export default Invite;

Invite.PreviewProps = {
  event: {
    title: "4 Pils og en pizza",
    dateTime: new Date(),
    publicId: "inr40by0",
  },
  inviterName: "Aslak",
} as InviteProps;
