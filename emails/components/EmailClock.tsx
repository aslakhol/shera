import { Img } from "@react-email/components";
import { formatInTimeZone } from "date-fns-tz";

const baseUrl =
  process.env.NODE_ENV === "production" ? process.env.BASE_URL ?? "" : "";

type ClockIconProps = { date: Date; size?: number; timeZone: string };

export const EmailClock = ({ date, size, timeZone }: ClockIconProps) => {
  const hour12 = Number(formatInTimeZone(date, timeZone, "H")) % 12;

  const clockImages = [
    "clock-12.png",
    "clock-1.png",
    "clock-2.png",
    "clock-3.png",
    "clock-4.png",
    "clock-5.png",
    "clock-6.png",
    "clock-7.png",
    "clock-8.png",
    "clock-9.png",
    "clock-10.png",
    "clock-11.png",
  ];

  const imagePath = `${baseUrl}/email/${clockImages[hour12]}`;

  return (
    <Img
      src={imagePath}
      width={size}
      height={size}
      alt={`Clock showing ${hour12 || 12}`}
    />
  );
};
