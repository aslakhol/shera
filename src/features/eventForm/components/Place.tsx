import TextInput from "@/components/TextInput";
import { UseFormReturn } from "react-hook-form";
import { EventSchemaType } from "../formValidation";

type PlaceProps = { methods: UseFormReturn<EventSchemaType> };

const Place = (props: PlaceProps) => {
  const { methods } = props;

  return (
    <TextInput
      name="place"
      label="Place"
      registerReturn={methods.register("place")}
      fieldError={methods.formState.errors.place}
    />
  );
};

export default Place;
