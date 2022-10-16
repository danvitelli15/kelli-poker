import { FormEvent } from "react";

export interface IFormProps {
  children: React.ReactNode;
  onSubmit: (formData: object, event?: FormEvent<HTMLFormElement>) => void;
}
