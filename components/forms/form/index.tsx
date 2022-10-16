import { RecoilRoot } from "recoil";
import { FormCore } from "./form";
import { IFormProps } from "./props";

export * from "./form";
export * from "./props";

export const Form = ({ children, onSubmit }: IFormProps) => (
  <RecoilRoot>
    <FormCore onSubmit={onSubmit}>{children}</FormCore>
  </RecoilRoot>
);
