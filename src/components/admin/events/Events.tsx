import { api } from "../../../utils/api";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

export const Events = () => {
  const events = api.events.events.useQuery();

  console.log(events, "events");

  return <DataTable columns={columns} data={events.data ?? []} />;
};
