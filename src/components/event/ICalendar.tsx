import type { Event } from "@prisma/client";
import { add } from "date-fns";
import type { User } from "next-auth";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { fullEventId } from "../../utils/event";
import { useEffect, useState } from "react";

type ICalendarProps = {
  event: Event & {
    host: User;
  };
};

const ICalendar = (props: ICalendarProps) => {
  const { event } = props;

  const sheraLink = `https://shera.no/events/${fullEventId(event)}`;

  const location = event.place ?? "";

  const createdAt = event.createdAt.toISOString().replace(/-|:|\.\d+/g, "");
  const startTime = event.dateTime.toISOString().replace(/-|:|\.\d+/g, "");
  const endTime = add(event.dateTime, { hours: 1 })
    .toISOString()
    .replace(/-|:|\.\d+/g, "");

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:shera.no
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${event.eventId}@shera.no
DTSTAMP:${createdAt}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, "\\n")}
URL:${sheraLink}
LOCATION:${location}
END:VEVENT
END:VCALENDAR
    `.trim();

  const [icsCalUrl, setIcsCalUrl] = useState<string>("");

  useEffect(() => {
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    setIcsCalUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [icsContent]);

  return (
    <Button asChild variant={"outline"} className="gap-2">
      <a className="link" href={icsCalUrl} download="shera-event.ics">
        <Calendar />
        <span>iCal</span>
      </a>
    </Button>
  );
};

export default ICalendar;
