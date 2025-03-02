import { type EventRowProps } from "./types";
import { type Attendee, type Event, type User } from "@prisma/client";

export const fullEventId = (event: { publicId: string; title: string }) => {
  return `${slugifyEvent(event)}-${event.publicId}`;
};

const slugStringMaxLength = 35;

export const slugifyEvent = (event: { title: string }) => {
  const slug = event.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-{2,}/g, "-");

  if (slug.length <= slugStringMaxLength) {
    return slug;
  }

  const lastDashWithinLimit = slug
    .substring(0, slugStringMaxLength)
    .lastIndexOf("-");
  if (lastDashWithinLimit > 0) {
    return slug.substring(0, lastDashWithinLimit);
  }

  return slug.substring(0, slugStringMaxLength);
};

export const categorizeEvents = (
  events: (Event & { host: User; attendees: Attendee[] })[],
) =>
  events.reduce<{
    finished: EventRowProps[];
    upcoming: EventRowProps[];
  }>(
    (acc, event) => {
      const eventDate = new Date(event.dateTime);
      const today = new Date();

      eventDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        return { ...acc, finished: [...acc.finished, { event }] };
      } else {
        return { ...acc, upcoming: [...acc.upcoming, { event }] };
      }
    },
    { finished: [], upcoming: [] },
  );

export const sortCategorizedEvents = (categorizedEvents: {
  finished: EventRowProps[];
  upcoming: EventRowProps[];
}) => ({
  finished: categorizedEvents.finished.sort(
    (a, b) =>
      new Date(b.event.dateTime).getTime() -
      new Date(a.event.dateTime).getTime(),
  ),
  upcoming: categorizedEvents.upcoming.sort(
    (a, b) =>
      new Date(a.event.dateTime).getTime() -
      new Date(b.event.dateTime).getTime(),
  ),
});
