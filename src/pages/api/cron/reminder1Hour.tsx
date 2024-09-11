import { type NextApiRequest, type NextApiResponse } from "next";
import { addMinutes } from "date-fns";
import { db } from "../../../server/db";
import sgEmail from "@sendgrid/mail";
import { env } from "../../../env";
import { type Attendee, type Event, type User } from "@prisma/client";
import { fullEventId } from "../../../utils/event";
import { render } from "@react-email/render";
import ReminderOneHour from "../../../../emails/ReminderOneHour";

sgEmail.setApiKey(env.SENDGRID_API_KEY);

type ResponseData = {
  message: string;
  reminderCount: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { message: string; error: unknown }>,
) {
  try {
    const authHeader = req.headers.authorization;
    if (
      !env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.end(401);
    }
    const oneHourFromNow = addMinutes(new Date(), 60);
    const firtyFiveMinutesFromNow = addMinutes(new Date(), 45);

    const events = await db.event.findMany({
      where: { dateTime: { gt: firtyFiveMinutesFromNow, lte: oneHourFromNow } },
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

    if (reminderCount <= 0) {
      return res.status(200).json({
        message: "No events to send reminders for",
        reminderCount,
      });
    }

    const reminderEmailsPerEvent = events
      .map((e) => getReminderEmail(e))
      .filter((eventEmail) => eventEmail.to.length > 0);

    await Promise.all(
      reminderEmailsPerEvent.map((eventEmail) =>
        sgEmail.sendMultiple(eventEmail),
      ),
    );

    return res.status(200).json({
      message: "Event reminders sent",
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
  const html = render(<ReminderOneHour event={event} />);

  return {
    to: attendeeEmails,
    from: env.EMAIL_FROM,
    subject: `Reminder: ${event.title} is happening tomorrow!`,
    text: `${event.title} is starting tomorrow at ${startTime}! Head over to ${eventUrl} to see if there is any more information.`,
    html,
  };
};
