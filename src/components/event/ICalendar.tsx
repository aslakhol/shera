import type { Event } from "@prisma/client";
import { add } from "date-fns";
import type { User } from "next-auth";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { fullEventId } from "../../utils/event";
import { useEffect, useState } from "react";

type ICalendarProps = {
  label?: string;
  event: Event & {
    host: User;
  };
};

const ICalendar = (props: ICalendarProps) => {
  const { event, label } = props;

  const sheraLink = `https://shera.no/events/${fullEventId(event)}`;

  const location = event.place ?? "";
  const description = `${event.description}\n\n${sheraLink}`.replace(
    /\n/g,
    "\\n",
  );

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
DESCRIPTION:${description}
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

  const filename = `shera-${fullEventId(event)}.ics`;

  return (
    <Button asChild variant="ghost" className="justify-start">
      <a className="w-full" href={icsCalUrl} download={filename}>
        {label ?? "iCal File"}
      </a>
    </Button>
  );
};

export default ICalendar;
