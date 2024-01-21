import { type EventSchemaType } from "../utils/formValidation";
import { EventForm } from "./EventForm";

export const CreateEvent = () => {
  const createEvent = (values: EventSchemaType) => {
    console.log(values, "createEvent");
  };

  return <EventForm onSubmit={createEvent} />;
};
