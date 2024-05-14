import { api } from "../../../utils/api";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

export const Events = () => {
  const events = api.events.events.useQuery();

  console.log(events, "events");

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={events.data ?? []} />
    </div>
  );
};
