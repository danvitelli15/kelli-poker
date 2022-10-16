import { useState } from "react";
import { Field } from "./field";
import { IEmailFieldProps, IPasswordFieldProps, ITextFieldProps } from "./props";

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

export const TextField = (props: ITextFieldProps) => <Field type="text" {...props}></Field>;
