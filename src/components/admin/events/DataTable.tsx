import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../../ui/table";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Eye, EyeOff } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "eventId", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <DateFilterButtons
        filterValue={table.getColumn("dateTime")?.getFilterValue()}
        setFilterValue={table.getColumn("dateTime")?.setFilterValue}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type DateFilterButtonsProps = {
  filterValue: unknown;
  setFilterValue?: (updater: unknown) => void;
};

const DateFilterButtons = ({
  filterValue,
  setFilterValue,
}: DateFilterButtonsProps) => {
  if (!setFilterValue) {
    return null;
  }
  return (
    <div className="flex items-center gap-4 py-4">
      <Button
        variant={"outline"}
        onClick={() => {
          const newValue = filterValue === "hide-future" ? "" : "hide-future";

          return setFilterValue(newValue);
        }}
      >
        Future events
        {filterValue === "hide-future" ? (
          <EyeOff className="ml-2 h-4 w-4" />
        ) : (
          <Eye className="ml-2 h-4 w-4" />
        )}
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          const newValue = filterValue === "hide-past" ? "" : "hide-past";

          return setFilterValue(newValue);
        }}
      >
        Past events
        {filterValue === "hide-past" ? (
          <EyeOff className="ml-2 h-4 w-4" />
        ) : (
          <Eye className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
