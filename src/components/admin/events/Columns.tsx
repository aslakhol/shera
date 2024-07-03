import { type Attendee, type User, type Event } from "@prisma/client";
import { type Column, type ColumnDef } from "@tanstack/react-table";
import { format, isFuture, isPast } from "date-fns";
import Link from "next/link";
import { fullEventId } from "../../../utils/event";
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { Button } from "../../ui/button";

export const columns: ColumnDef<
  Event & { host: User; attendees: Attendee[] }
>[] = [
  {
    accessorKey: "eventId",
    header: ({ column }) => <SortHeader headerTitle="ID" column={column} />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "dateTime",
    header: ({ column }) => <SortHeader headerTitle="Date" column={column} />,
    accessorFn: (row) => format(row.dateTime, "d/LL/yy HH:mm"),
    filterFn: (row, _, filterValue) => {
      const date = row.original.dateTime;
      if (!date || !filterValue) {
        return true;
      }

      if (filterValue === "hide-future") {
        return !isFuture(date);
      }
      if (filterValue === "hide-past") {
        return !isPast(date);
      }
      return true;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <SortHeader headerTitle="Title" column={column} />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "host.name",
    header: ({ column }) => <SortHeader headerTitle="Host" column={column} />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "place",
    header: ({ column }) => <SortHeader headerTitle="Place" column={column} />,
  },
  {
    accessorKey: "attendees.length",
    header: ({ column }) => (
      <SortHeader headerTitle="Attendees" column={column} />
    ),
    accessorFn: (row) => row.attendees.length,
  },
  {
    accessorKey: "attendees.status.going",
    header: ({ column }) => <SortHeader headerTitle="Going" column={column} />,
    accessorFn: (row) =>
      row.attendees.filter((a) => a.status === "GOING").length,
  },
  {
    accessorKey: "attendees.status.notGoing",
    header: ({ column }) => (
      <SortHeader headerTitle="Not going" column={column} />
    ),
    accessorFn: (row) =>
      row.attendees.filter((a) => a.status === "NOT_GOING").length,
  },
  {
    accessorKey: "attendees.status.maybe",
    header: ({ column }) => <SortHeader headerTitle="Maybe" column={column} />,
    accessorFn: (row) =>
      row.attendees.filter((a) => a.status === "MAYBE").length,
  },
  {
    accessorKey: "publicId",
    header: () => <Header headerTitle="Link" />,
    accessorFn: (row) => row,
    cell: (info) => {
      const event = info.getValue<
        Event & { host: User; attendees: Attendee[] }
      >();
      return (
        <Link href={`/events/${fullEventId(event)}`}>
          <ExternalLink />
        </Link>
      );
    },
  },
];

type SortHeaderProps = {
  headerTitle: string;
  column: Column<Event & { host: User; attendees: Attendee[] }>;
};

const SortHeader = ({ headerTitle, column }: SortHeaderProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {headerTitle}
      {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      {column.getIsSorted() === "desc" && (
        <ArrowDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

type HeaderProps = {
  headerTitle: string;
};

const Header = ({ headerTitle }: HeaderProps) => {
  return <div className="px-4">{headerTitle}</div>;
};
