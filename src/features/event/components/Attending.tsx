import Modal from "@/components/Modal";
import { trpc } from "@/utils/trpc";

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
        attendees.map((attendee, index) => (
          <li key={`${attendee.name}-${index}`}>{attendee.name}</li>
        ))}
    </Modal>
  );
};

export default Attending;
