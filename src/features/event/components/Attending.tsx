import { trpc } from "@/utils/trpc";

type AttendingProps = { eventId: number };

const Attending = (props: AttendingProps) => {
  const { eventId } = props;

  const { data: attendees, isSuccess } = trpc.useQuery([
    "events.attendees",
    { eventId },
  ]);

  return (
    <>
      <label htmlFor="attending-modal" className="btn modal-button btn-outline">
        {attendees?.length || 0} going
      </label>

      <input type="checkbox" id="attending-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="attending-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Attendees:</h3>
          <ul className="py-4">
            {isSuccess &&
              attendees.map((attendee, index) => (
                <li key={`${attendee.name}-${index}`}>{attendee.name}</li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Attending;
