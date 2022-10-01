import Textarea from "@/components/Textarea";
import { UseFormReturn } from "react-hook-form";
import { EventSchemaType } from "../formValidation";

type DescriptionProps = { methods: UseFormReturn<EventSchemaType> };

const Description = (props: DescriptionProps) => {
  const { methods } = props;

  return (
    <Textarea
      name="description"
      label="Description"
      registerReturn={methods.register("description")}
      fieldError={methods.formState.errors.description}
    />
  );
};

export default Description;
