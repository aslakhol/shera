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
import AttendanceReminder1Week from "../../../../emails/AttendanceReminder1Week";
import AttendanceReminder3Days from "../../../../emails/AttendanceReminder3Days";

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

    const eventsReminderTomorrow = await getReminderTomorrowEvents();
    const eventsAttendance1Week = await getAttendance1WeekEvents();
    const eventsAttendance3Days = await getAttendance3DaysEvents();

    const reminderCount = [
      ...eventsReminderTomorrow,
      ...eventsAttendance1Week.maybeEvents,
      ...eventsAttendance1Week.invitedEvents,
      ...eventsAttendance3Days.maybeEvents,
      ...eventsAttendance3Days.invitedEvents,
    ]
      .map((e) => e.attendees.length)
      .reduce((a, b) => a + b, 0);

    if (reminderCount <= 0) {
      return res.status(200).json({
        message: "No events to send reminders for",
        summary: "",
        reminderCount,
      });
    }

    const reminderTomorrowEmailsPerEvent = eventsReminderTomorrow
      .map((e) => getReminderTomorrowEmail(e))
      .filter((eventEmail) => eventEmail.to.length > 0);

    const invited1WeekEmailsPerEvent = eventsAttendance1Week.invitedEvents
      .map((e) => getAttendance1WeekEmail(e, "INVITED"))
      .filter((eventEmail) => eventEmail.to.length > 0);

    const maybe1WeekEmailsPerEvent = eventsAttendance1Week.maybeEvents
      .map((e) => getAttendance1WeekEmail(e, "MAYBE"))
      .filter((eventEmail) => eventEmail.to.length > 0);

    const invited3DaysEmailsPerEvent = eventsAttendance3Days.invitedEvents
      .map((e) => getAttendance3DaysEmail(e, "INVITED"))
      .filter((eventEmail) => eventEmail.to.length > 0);

    const maybe3DaysEmailsPerEvent = eventsAttendance3Days.maybeEvents
      .map((e) => getAttendance3DaysEmail(e, "MAYBE"))
      .filter((eventEmail) => eventEmail.to.length > 0);

    await Promise.all(
      [
        ...reminderTomorrowEmailsPerEvent,
        ...invited1WeekEmailsPerEvent,
        ...maybe1WeekEmailsPerEvent,
        ...invited3DaysEmailsPerEvent,
        ...maybe3DaysEmailsPerEvent,
      ].map((eventEmail) => sgEmail.sendMultiple(eventEmail)),
    );

    const summaryMessage = {
      to: "aslak@shera.no",
      from: env.EMAIL_FROM,
      subject: "Email reminders sent from Shera",
      text: `Sent email reminders for the following events: ${eventsReminderTomorrow.map((e) => `${e.title}: ${e.attendees.length} emails`).join("\n\n ")} \n\n Total reminders sent: ${reminderCount}`,
      html: `<p>Sent email reminders for the following events:</p>
    <ul>
    ${eventsReminderTomorrow.map((e) => `<li>${e.title}: ${e.attendees.length} emails</li>`).join()}
    </ul>
    <p>Total reminders sent: ${reminderCount}</p>`,
    };

    await sgEmail.send(summaryMessage);

    return res.status(200).json({
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

const getReminderTomorrowEvents = async () => {
  const tomorrowStart = startOfTomorrow();
  const tomorrowEnd = endOfTomorrow();

  const events = await db.event.findMany({
    where: { dateTime: { gte: tomorrowStart, lte: tomorrowEnd } },
    include: {
      attendees: {
        where: {
          email: { not: null },
          OR: [{ status: "GOING" }, { status: "MAYBE" }],
        },
      },
      host: true,
    },
  });
  return events;
};

const getAttendance1WeekEvents = async () => {
  const startOf1WeekFromNow = addDays(startOfToday(), 7);
  const endOf1WeekFromNow = addDays(endOfToday(), 7);

  const maybeEvents = await db.event.findMany({
    where: {
      dateTime: { gte: startOf1WeekFromNow, lte: endOf1WeekFromNow },
    },
    include: {
      attendees: { where: { email: { not: null }, status: "MAYBE" } },
      host: true,
    },
  });
  const invitedEvents = await db.event.findMany({
    where: {
      dateTime: { gte: startOf1WeekFromNow, lte: endOf1WeekFromNow },
    },
    include: {
      attendees: { where: { email: { not: null }, status: "INVITED" } },
      host: true,
    },
  });

  return { maybeEvents, invitedEvents };
};

const getAttendance3DaysEvents = async () => {
  const startOf3DaysFromNow = addDays(startOfToday(), 3);
  const endOf3DaysFromNow = addDays(endOfToday(), 3);

  const maybeEvents = await db.event.findMany({
    where: {
      dateTime: { gte: startOf3DaysFromNow, lte: endOf3DaysFromNow },
    },
    include: {
      attendees: { where: { email: { not: null }, status: "MAYBE" } },
      host: true,
    },
  });
  const invitedEvents = await db.event.findMany({
    where: {
      dateTime: { gte: startOf3DaysFromNow, lte: endOf3DaysFromNow },
    },
    include: {
      attendees: { where: { email: { not: null }, status: "INVITED" } },
      host: true,
    },
  });

  return { maybeEvents, invitedEvents };
};

const getReminderTomorrowEmail = (
  event: Event & { host: User } & { attendees: Attendee[] },
) => {
  const attendeeEmails = event.attendees
    .map((a) => a.email!)
    .filter((email) => email !== null);

  const html = render(<EventTomorrow event={event} />);
  const text = render(<EventTomorrow event={event} />, {
    plainText: true,
  });

  return {
    to: attendeeEmails,
    from: env.EMAIL_FROM,
    subject: `${event.title} is happening tomorrow!`,
    text,
    html,
  };
};

const getAttendance1WeekEmail = (
  event: Event & { host: User } & { attendees: Attendee[] },
  attendanceStatus: "INVITED" | "MAYBE",
) => {
  const attendeeEmails = event.attendees
    .map((a) => a.email!)
    .filter((email) => email !== null);

  const html = render(
    <AttendanceReminder1Week
      event={event}
      attendanceStatus={attendanceStatus}
    />,
  );
  const text = render(
    <AttendanceReminder1Week
      event={event}
      attendanceStatus={attendanceStatus}
    />,
    {
      plainText: true,
    },
  );

  return {
    to: attendeeEmails,
    from: env.EMAIL_FROM,
    subject: `Are you going to ${event.title} in 3 days?`,
    text,
    html,
  };
};

const getAttendance3DaysEmail = (
  event: Event & { host: User } & { attendees: Attendee[] },
  attendanceStatus: "INVITED" | "MAYBE",
) => {
  const attendeeEmails = event.attendees
    .map((a) => a.email!)
    .filter((email) => email !== null);

  const html = render(
    <AttendanceReminder3Days
      event={event}
      attendanceStatus={attendanceStatus}
    />,
  );
  const text = render(
    <AttendanceReminder3Days
      event={event}
      attendanceStatus={attendanceStatus}
    />,
    {
      plainText: true,
    },
  );

  return {
    to: attendeeEmails,
    from: env.EMAIL_FROM,
    subject: `Are you going to ${event.title} in 3 days?`,
    text,
    html,
  };
};
