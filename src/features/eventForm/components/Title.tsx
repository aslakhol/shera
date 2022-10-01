import TextInput from "@/components/TextInput";
import { UseFormReturn } from "react-hook-form";
import { EventSchemaType } from "../formValidation";

type TitleProps = { methods: UseFormReturn<EventSchemaType> };

const Title = (props: TitleProps) => {
  const { methods } = props;

  return (
    <TextInput
      name="title"
      label="Title"
      registerReturn={methods.register("title")}
      fieldError={methods.formState.errors.title}
    />
  );
};

export default Title;
