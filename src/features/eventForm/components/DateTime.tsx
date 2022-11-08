import { UseFormReturn } from "react-hook-form";
import { EventSchemaType } from "../formValidation";

type DateTimeProps = { methods: UseFormReturn<EventSchemaType> };

const DateTime = (props: DateTimeProps) => {
  const { methods } = props;

  return (
    <div className="form-control">
      <label className="label" htmlFor={"dateTime"}>
        <span className="label-text">
          DateTime
          {/* {required && <span>*</span>} */}
        </span>
      </label>
      <input
        id={"dateTime"}
        type="datetime-local"
        className={`input input-bordered w-full max-w-xs ${
          methods.formState.errors.dateTime ? "input-error" : ""
        }`}
        {...methods.register("dateTime")}
      />
      {methods.formState.errors.dateTime?.message && (
        <label className="label">
          <span className="label-text-alt text-error">
            <>{methods.formState.errors.dateTime.message}</>
          </span>
        </label>
      )}
    </div>
  );
};

export default DateTime;
