import { format } from "date-fns";

type Props = { event: { dateTime: Date } };

export const WhenBadge = ({ event }: Props) => {
  return (
    <div className="flex gap-2">
      <div className="w-10 rounded border-2 border-secondary font-bold">
        <div className="bg-secondary p-1 py-0 text-center text-[0.5rem] uppercase">
          {format(event.dateTime, "MMM")}
        </div>
        <div className="text-center">{format(event.dateTime, "d")}</div>
      </div>
      <div>
        <p className="font-semibold leading-tight">
          {format(event.dateTime, "EEEE, LLLL do")}
        </p>
        <p className="text-sm">{format(event.dateTime, "H:mm")}</p>
      </div>
    </div>
  );
};
