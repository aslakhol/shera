import { UseFormRegisterReturn, FieldError } from "react-hook-form";

type TextareaProps = {
  name: string;
  label: string;
  placeholder?: string;
  registerReturn: UseFormRegisterReturn;
  fieldError?: FieldError;
};

const Textarea = (props: TextareaProps) => {
  const { name, label, placeholder, registerReturn, fieldError } = props;

  return (
    <div className="form-control">
      <label className="label" htmlFor={name}>
        <span className="label-text">{label}</span>
      </label>
      <textarea
        id={name}
        placeholder={placeholder || label}
        className={`textarea textarea-bordered h-24 ${
          fieldError ? "input-error" : ""
        }`}
        {...registerReturn}
      />
      {fieldError?.message && (
        <label className="label">
          <span className="label-text-alt text-error">
            {fieldError.message}
          </span>
        </label>
      )}
    </div>
  );
};

export default Textarea;
