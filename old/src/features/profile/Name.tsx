import TextInput from "@/components/TextInput";
import { UseFormReturn } from "react-hook-form";
import { ProfileSchemaType } from "./formValidation";

type NameProps = { methods: UseFormReturn<ProfileSchemaType> };

const Name = (props: NameProps) => {
  const { methods } = props;

  return (
    <TextInput
      name="name"
      label="Name"
      registerReturn={methods.register("name")}
      fieldError={methods.formState.errors.name}
    />
  );
};

export default Name;
