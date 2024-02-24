import { format } from "date-fns";
import {
  Clock12,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock,
} from "lucide-react";

type ClockIconProps = { date: Date; size?: number };

export const WorkingClock = ({ date, size }: ClockIconProps) => {
  const hour12 = Number(format(date, "H")) % 12;
  if (hour12 === 0) return <Clock12 size={size} />;
  if (hour12 === 1) return <Clock1 size={size} />;
  if (hour12 === 2) return <Clock2 size={size} />;
  if (hour12 === 3) return <Clock3 size={size} />;
  if (hour12 === 4) return <Clock4 size={size} />;
  if (hour12 === 5) return <Clock5 size={size} />;
  if (hour12 === 6) return <Clock6 size={size} />;
  if (hour12 === 7) return <Clock7 size={size} />;
  if (hour12 === 8) return <Clock8 size={size} />;
  if (hour12 === 9) return <Clock9 size={size} />;
  if (hour12 === 10) return <Clock10 size={size} />;
  if (hour12 === 11) return <Clock11 size={size} />;
  return <Clock size={size} />;
};
