import { UseFormRegisterReturn, FieldError } from "react-hook-form";

type TextInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  registerReturn: UseFormRegisterReturn;
  fieldError?: FieldError;
  type?: "text" | "email" | "password" | "url";
  description?: string;
};

const TextInput = (props: TextInputProps) => {
  const {
    name,
    label,
    placeholder,
    required,
    registerReturn,
    fieldError,
    description,
    type = "text",
  } = props;

  return (
    <div className="form-control">
      <label className="label" htmlFor={name}>
        <span className="label-text">
          {label}
          {required && <span>*</span>}
        </span>
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder || label}
        className={`input input-bordered w-full max-w-xs ${
          fieldError ? "input-error" : ""
        }`}
        {...registerReturn}
      />
      {description && (
        <label className="label">
          <span className="label-text-alt">{description}</span>
        </label>
      )}
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

export default TextInput;
