import { type NextApiRequest, type NextApiResponse } from "next";
import { endOfTomorrow, startOfTomorrow } from "date-fns";
import { db } from "../../../server/db";
import sgEmail from "@sendgrid/mail";
import { env } from "../../../env";
import { type Attendee, type Event, type User } from "@prisma/client";
import { fullEventId } from "../../../utils/event";
import { render } from "@react-email/render";
import EventTomorrow from "../../../../emails/EventTomorrow";

sgEmail.setApiKey(env.SENDGRID_API_KEY);

type ResponseData = {
  message: string;
  summary: string;
  reminderCount: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.query.key !== env.CRON_KEY) {
      return res.end(404);
    }

    const tomorrowStart = startOfTomorrow();
    const tomorrowEnd = endOfTomorrow();

    const events = await db.event.findMany({
      where: { dateTime: { gte: tomorrowStart, lte: tomorrowEnd } },
      include: { attendees: { where: { email: { not: null } } }, host: true },
    });
    const reminderCount = events
      .map(
        (e) =>
          e.attendees.filter(
            (a) => a.status === "GOING" || a.status === "MAYBE",
          ).length,
      )
      .reduce((a, b) => a + b, 0);

    const reminderEmailsPerEvent = events.map((e) => getReminderEmail(e));

    res.status(200).json({ reminderCount, reminderEmailsPerEvent, events });
    return;

    await Promise.all(
      reminderEmailsPerEvent.map((eventEmail) =>
        sgEmail.sendMultiple(eventEmail),
      ),
    );

    const summaryMessage = {
      to: "aslak@shera.no",
      from: env.EMAIL_FROM,
      subject: "Email reminders sent from Shera",
      text: `Sent email reminders for the following events: ${events.map((e) => `${e.title}: ${e.attendees.map((a) => a.email).join(",")}`).join("\n\n ")} \n\n Total reminders sent: ${reminderCount}`,
      html: `<p>Sent email reminders for the following events:</p>
    <ul>
    ${events.map((e) => `<li>${e.title}: ${e.attendees.map((a) => a.email).join(",")}</li>`).join()}
    </ul>
    <p>Total reminders sent: ${reminderCount}</p>`,
    };

    await sgEmail.send(summaryMessage);

    res.status(200).json({
      message: "Event reminders sent",
      summary: summaryMessage.text,
      reminderCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error sending email reminders",
      error,
    });
  }
}

const getReminderEmail = (
  event: Event & { host: User } & { attendees: Attendee[] },
) => {
  const attendeesGoingOrMaybe = event.attendees.filter(
    (a) => a.status === "GOING" || a.status === "MAYBE",
  );
  const attendeeEmails = attendeesGoingOrMaybe
    .map((a) => a.email!)
    .filter((email) => email !== null);

  const startTime = event.dateTime.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
  });

  const eventUrl = `https://shera.no/events/${fullEventId(event)}`;
  const html = render(<EventTomorrow event={event} />);

  return {
    to: attendeeEmails,
    from: env.EMAIL_FROM,
    subject: `Reminder: ${event.title} is happening tomorrow!`,
    text: `${event.title} is starting tomorrow at ${startTime}! Head over to ${eventUrl} to see if there is any more information.`,
    html,
  };
};
