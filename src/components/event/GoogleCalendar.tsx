import { add } from "date-fns";
import { Button } from "../ui/button";
import { fullEventId } from "../../utils/event";
import { type EventWithHosts } from "../../utils/types";

type GoogleCalendarProps = {
  event: EventWithHosts;
};

const GoogleCalendar = (props: GoogleCalendarProps) => {
  const { event } = props;

  const title = encodeURIComponent(event.title);
  const sheraLink = `https://shera.no/events/${fullEventId(event)}`;

  const description = encodeURIComponent(
    `${event.description}\n\n${sheraLink}`,
  );

  const location = encodeURIComponent(event.place ?? "");

  const startTime = event.dateTime.toISOString().replace(/-|:|\.\d+/g, "");
  const endTime = add(event.dateTime, { hours: 1 })
    .toISOString()
    .replace(/-|:|\.\d+/g, "");
  const time = `${startTime}%2F${endTime}`;

  const timezone = encodeURIComponent(event.timeZone);

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&location=${location}&dates=${time}&ctz=${timezone}`;

  return (
    <Button asChild variant="ghost" className="justify-start gap-2">
      <a
        className="w-full"
        target="_blank"
        href={url}
        rel="noopener noreferrer"
      >
        Google Calendar
      </a>
    </Button>
  );
};

export default GoogleCalendar;
