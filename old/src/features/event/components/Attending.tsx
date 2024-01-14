import Modal from "@/components/Modal";
import { trpc } from "@/utils/trpc";
import Attendee from "./Attendee";

type AttendingProps = { eventId: number };

const Attending = (props: AttendingProps) => {
  const { eventId } = props;

  const { data: attendees, isSuccess } = trpc.useQuery([
    "events.attendees",
    { eventId },
  ]);

  return (
    <Modal
      modalId="attending-modal"
      buttonText={`${attendees?.length || 0} going`}
      title={"Attendees:"}
    >
      {isSuccess &&
        attendees.map((attendee) => (
          <Attendee
            key={`${attendee.attendeeId}`}
            eventId={eventId}
            attendee={attendee}
          />
        ))}
    </Modal>
  );
};

export default Attending;
