import { UseFormRegisterReturn, FieldError } from "react-hook-form";

type TextInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  registerReturn: UseFormRegisterReturn;
  fieldError?: FieldError;
};

const TextInput = (props: TextInputProps) => {
  const { name, label, placeholder, required, registerReturn, fieldError } =
    props;

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
        type="text"
        placeholder={placeholder || label}
        className={`input input-bordered w-full max-w-xs ${
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

export default TextInput;
