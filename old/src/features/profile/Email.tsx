import TextInput from "@/components/TextInput";
import { UseFormReturn } from "react-hook-form";
import { ProfileSchemaType } from "./formValidation";

type EmailProps = { methods: UseFormReturn<ProfileSchemaType> };

const Email = (props: EmailProps) => {
  const { methods } = props;

  return (
    <TextInput
      name="email"
      type="email"
      label="Email"
      registerReturn={methods.register("email")}
      fieldError={methods.formState.errors.email}
    />
  );
};

export default Email;
