import { type Event } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "dateTime",
    header: "Date",
  },
  {
    accessorKey: "place",
    header: "Place",
  },
];
