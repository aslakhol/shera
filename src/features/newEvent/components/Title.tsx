import { UseFormReturn } from "react-hook-form";
import TextInput from "../../../components/TextInput";
import { CreateEventSchemaType } from "../formValidation";

type TitleProps = { methods: UseFormReturn<CreateEventSchemaType> };

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
