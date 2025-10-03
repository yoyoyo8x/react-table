import { Form, Input } from "antd";
import React, { ChangeEvent } from "react";
import { Controller, get } from "react-hook-form";

interface InputHookFormProps {
  name: string;
  label?: React.ReactNode;
  control: any;
  errors?: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const InputHookForm: React.FC<InputHookFormProps> = ({
  name,
  label = "",
  control,
  errors,
  placeholder,
  required = false,
  disabled = false,
  onChange,
  value,
}) => {
  const inputId = `input-${name}`;
  const fieldError = get(errors, name);

  return (
    <Form.Item
      htmlFor={inputId}
      label={label}
      required={required}
      validateStatus={fieldError ? "error" : "success"}
      help={
        fieldError && (
          <div className="flex gap-1">
            <p>{fieldError.message?.toString()}</p>
          </div>
        )
      }
    >
      <Controller
        name={name}
        control={control}
        rules={{ required: required }}
        render={({ field }) => (
          <div>
            <Input
              {...field}
              id={inputId}
              value={value ?? field.value}
              placeholder={placeholder}
              onChange={(event) => {
                const value = event.target.value;
                field.onChange(value);
                if (onChange) {
                  onChange(event);
                }
              }}
              disabled={disabled}
            />
          </div>
        )}
      />
    </Form.Item>
  );
};

export default InputHookForm;
