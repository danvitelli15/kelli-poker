import { RecoilRoot } from "recoil";
import { FormCore } from "./form";
import { IFormProps } from "./props";

export * from "./form";
export * from "./props";

export const Form = ({ children, ...props }: IFormProps) => (
  <RecoilRoot>
    <FormCore {...props}>{children}</FormCore>
  </RecoilRoot>
);
