import { Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { Controller, get } from "react-hook-form";

interface TextAreaHookFormProps {
  name: string;
  label: string | React.ReactNode;
  control: any;
  errors?: any;
  placeholder?: string;
  required?: boolean;
  row?: number;
  disabled?: boolean;
}

const TextAreaHookForm: React.FC<TextAreaHookFormProps> = ({
  name,
  label,
  control,
  errors,
  placeholder,
  required = false,
  row = 4,
  disabled = false,
}) => {
  const textAreaId = `text-area-${name}`;
  const fieldError = get(errors, name);

  return (
    <Form.Item
      htmlFor={textAreaId}
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
          <TextArea
            {...field}
            id={textAreaId}
            placeholder={placeholder}
            rows={row}
            showCount={false}
            disabled={disabled}
          />
        )}
      />
    </Form.Item>
  );
};

export default TextAreaHookForm;
