import { FormEvent, useCallback } from "react";
import { useRecoilCallback } from "recoil";
import { formData, formFieldIDs } from "../state";
import { IFormProps } from "./props";

export const FormCore = ({ children, onSubmit }: IFormProps) => {
  const getAllFieldState = useRecoilCallback(({ snapshot }) => () => {
    const form = {};
    const keys = snapshot.getLoadable(formFieldIDs).getValue();
    keys.forEach((identifier) => {
      form[identifier] = snapshot.getLoadable(formData(identifier)).getValue();
    });
    return form;
  });

  const formSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = getAllFieldState();
      onSubmit(form, event);
    },
    [getAllFieldState, onSubmit]
  );

  return <form onSubmit={formSubmit}>{children}</form>;
};
