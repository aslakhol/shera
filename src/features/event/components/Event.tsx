import { trpc } from "../../../utils/trpc";

type EventProps = { eventId: string };

const Event = (props: EventProps) => {
  const { eventId } = props;

  const { data: event, isSuccess } = trpc.useQuery([
    "events.event",
    { eventId },
  ]);

  if (!isSuccess) {
    return <></>;
  }

  if (event === null) {
    return <>No event with id {eventId}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto w-10/12 md:w-1/2">
      <div className="prose">
        <h1 className="py-2 text-center">{event.title}</h1>
      </div>

      <div className="py-2" />

      <div className="info flex flex-col gap-2">
        <span>Time: {event.time}</span>
        <span>Place: {event.place}</span>
      </div>

      <div className="py-2" />

      <div className="description prose">
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default Event;
