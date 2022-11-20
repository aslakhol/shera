import TextInput from "@/components/TextInput";
import { UseFormReturn } from "react-hook-form";
import { ProfileSchemaType } from "./formValidation";

type ImageProps = { methods: UseFormReturn<ProfileSchemaType> };

const Image = (props: ImageProps) => {
  const { methods } = props;

  return (
    <TextInput
      name="image"
      label="Profile Picture"
      type="url"
      description="URL to your profile picture"
      registerReturn={methods.register("image")}
      fieldError={methods.formState.errors.image}
    />
  );
};

export default Image;
