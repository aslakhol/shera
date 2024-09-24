import { type NextApiRequest, type NextApiResponse } from "next";
import {
  addDays,
  endOfToday,
  endOfTomorrow,
  startOfToday,
  startOfTomorrow,
} from "date-fns";
import { db } from "../../../server/db";
import sgEmail from "@sendgrid/mail";
import { env } from "../../../env";
import { type Attendee, type Event, type User } from "@prisma/client";
import { render } from "@react-email/render";
import EventTomorrow from "../../../../emails/EventTomorrow";
import { MaybeAttending3Days } from "../../../../emails/MaybeAttending3Days";

sgEmail.setApiKey(env.SENDGRID_API_KEY);

type ResponseData = {
  message: string;
  summary: string;
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
    const startOf3DaysFromNow = addDays(startOfToday(), 3);
    const endOf3DaysFromNow = addDays(endOfToday(), 3);

    const events = await db.event.findMany({
      where: {
        dateTime: { gte: startOf3DaysFromNow, lte: endOf3DaysFromNow },
      },
      include: { attendees: { where: { email: { not: null } } }, host: true },
    });
    const reminderCount = events
      .map((e) => e.attendees.filter((a) => a.status === "MAYBE").length)
      .reduce((a, b) => a + b, 0);

    if (reminderCount <= 0) {
      return res.status(200).json({
        message: "No events to send attendance reminders for",
        summary: "",
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error sending 3 day attendance reminders",
      error,
    });
  }
}

const getReminderEmail = (
  event: Event & { host: User } & { attendees: Attendee[] },
) => {
  const attendeesMaybe = event.attendees.filter((a) => a.status === "MAYBE");
  const attendeeEmails = attendeesMaybe
    .map((a) => a.email!)
    .filter((email) => email !== null);

  const html = render(<MaybeAttending3Days event={event} />);
  const text = render(<MaybeAttending3Days event={event} />, {
    plainText: true,
  });

  return {
    to: attendeeEmails,
    from: env.EMAIL_FROM,
    subject: `Are you going to ${event.title} in 3 days?`,
    text,
    html,
  };
};
