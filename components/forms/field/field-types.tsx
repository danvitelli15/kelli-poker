import { useState } from "react";
import { Field } from "./field";
import { IDateFieldProps, IEmailFieldProps, IPasswordFieldProps, ISelectFieldProps, ITextFieldProps } from "./props";

export const DateField = (props: IDateFieldProps) => <Field type="date" {...props}></Field>;

export const EmailField = (props: IEmailFieldProps) => <Field type="email" {...props}></Field>;

export const PasswordField = (props: IPasswordFieldProps) => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <Field type="password" {...props}>
      {props.showable ? (
        <button onClick={() => setIsHidden((wasHidden) => !wasHidden)}>{isHidden ? "Show" : "Hide"}</button>
      ) : null}
    </Field>
  );
};

export const SubmitButton = ({ children, ...props }) => (
  <button type="submit" {...props}>
    {children}
  </button>
);

export const TextField = (props: ITextFieldProps) => <Field type="text" {...props}></Field>;
