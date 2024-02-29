import type { Event } from "@prisma/client";
import { add } from "date-fns";
import type { User } from "next-auth";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { fullEventId } from "../../utils/event";

type GoogleCalendarProps = {
  event: Event & {
    host: User;
  };
};

const GoogleCalendar = (props: GoogleCalendarProps) => {
  const { event } = props;

  const title = event.title;
  const sheraLink = `https://shera.no/events/${fullEventId(event)}`;

  const description = `${sheraLink}%0A%0A${event.description.replaceAll(
    "\n",
    "%0A",
  )}`;
  const location = event.place;

  const startTime = event.dateTime.toISOString().replace(/-|:|\.\d+/g, "");
  const endTime = add(event.dateTime, { hours: 1 })
    .toISOString()
    .replace(/-|:|\.\d+/g, "");
  const time = `${startTime}%2F${endTime}`;

  const timezone = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace("/", "%2F");

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&location=${location}&dates=${time}&ctz=${timezone}`;

  return (
    <Button asChild variant={"outline"}>
      <a className="link" target="_blank" href={url} rel="noopener noreferrer">
        <Calendar />
      </a>
    </Button>
  );
};

export default GoogleCalendar;
