import { Img } from "@react-email/components";
import { formatInTimeZone } from "date-fns-tz";

const baseUrl = process.env.BASE_URL ? `${process.env.BASE_URL}` : "";

type ClockIconProps = { date: Date; size?: number; timeZone: string };

export const EmailClock = ({ date, size, timeZone }: ClockIconProps) => {
  const hour12 = Number(formatInTimeZone(date, timeZone, "H")) % 12;
  if (hour12 === 0)
    return (
      <Img src={`${baseUrl}/email/clock-12.png`} width={size} height={size} />
    );
  if (hour12 === 1)
    return (
      <Img src={`${baseUrl}/email/clock-1.png`} width={size} height={size} />
    );
  if (hour12 === 2)
    return (
      <Img src={`${baseUrl}/email/clock-2.png`} width={size} height={size} />
    );
  if (hour12 === 3)
    return (
      <Img src={`${baseUrl}/email/clock-3.png`} width={size} height={size} />
    );
  if (hour12 === 4)
    return (
      <Img src={`${baseUrl}/email/clock-4.png`} width={size} height={size} />
    );
  if (hour12 === 5)
    return (
      <Img src={`${baseUrl}/email/clock-5.png`} width={size} height={size} />
    );
  if (hour12 === 6)
    return (
      <Img src={`${baseUrl}/email/clock-6.png`} width={size} height={size} />
    );
  if (hour12 === 7)
    return (
      <Img src={`${baseUrl}/email/clock-7.png`} width={size} height={size} />
    );
  if (hour12 === 8)
    return (
      <Img src={`${baseUrl}/email/clock-8.png`} width={size} height={size} />
    );
  if (hour12 === 9)
    return (
      <Img src={`${baseUrl}/email/clock-9.png`} width={size} height={size} />
    );
  if (hour12 === 10)
    return (
      <Img src={`${baseUrl}/email/clock-10.png`} width={size} height={size} />
    );
  if (hour12 === 11)
    return (
      <Img src={`${baseUrl}/email/clock-11.png`} width={size} height={size} />
    );
  return <Img src={`${baseUrl}/email/clock.png`} width={size} height={size} />;
};
