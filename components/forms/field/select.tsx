import { ISelectFieldProps } from "./props";

export const SelectField = (props: ISelectFieldProps) => (
  <select className="form-select">
    {props.options.map((option, index) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);
