import TextInput from "@/components/TextInput";
import { UseFormReturn } from "react-hook-form";
import { EventSchemaType } from "../formValidation";

type TimeProps = { methods: UseFormReturn<EventSchemaType> };

const Time = (props: TimeProps) => {
  const { methods } = props;

  return (
    <TextInput
      name="time"
      label="Time"
      registerReturn={methods.register("time")}
      fieldError={methods.formState.errors.time}
    />
  );
};

export default Time;
