import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { formData, formFieldIDs } from "../state";
import { FormFieldProps } from "./props";

export const Field = (props: FormFieldProps) => {
  const { identifier, label, name, type, ...rest } = props;

  const [value, setValue] = useRecoilState(formData(props.identifier));
  const setFields = useSetRecoilState(formFieldIDs);

  useEffect(() => {
    setFields((fields) => [...fields, props.identifier]);
    return () => setFields((fields) => fields.filter((field) => field !== props.identifier));
  }, [setFields, props.identifier]);

  return (
    <div>
      <label htmlFor={identifier}>{label}</label>
      <input
        id={identifier}
        name={identifier}
        onChange={(event) => {
          if (props.onChange) props.onChange(event);
          setValue(event.target.value);
        }}
        type={type}
        value={value}
        {...rest}
      />
      {props.children}
    </div>
  );
};
