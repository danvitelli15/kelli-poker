import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";

interface ISharedFieldProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  identifier: string;
  label: string;
}

export interface IDateFieldProps extends ISharedFieldProps {}

export interface IEmailFieldProps extends ISharedFieldProps {}

export interface IFormFieldProps extends ISharedFieldProps {
  type: string;
}

export interface IPasswordFieldProps extends ISharedFieldProps {
  showable?: boolean;
}

export interface ISelectFieldProps extends ISharedFieldProps {
  options: string[];
}

export interface ITextFieldProps extends ISharedFieldProps {}
