import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { Event } from "@prisma/client";
import type { User } from "next-auth";
import GoogleCalendar from "./GoogleCalendar";
import ICalendar from "./ICalendar";

type Props = {
  event: Event & {
    host: User;
  };
};

export const AddToCalendar = ({ event }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar />
          Add to Calendar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col gap-2 p-1">
        <GoogleCalendar event={event} />
        <ICalendar event={event} label="Apple" />
        <ICalendar event={event} label="Outlook" />
        <ICalendar event={event} />
      </PopoverContent>
    </Popover>
  );
};
