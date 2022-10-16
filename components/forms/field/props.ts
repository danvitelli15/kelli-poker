import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";

interface ISharedFieldProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  identifier: string;
  label: string;
}

export interface IEmailFieldProps extends ISharedFieldProps {}

export interface FormFieldProps extends ISharedFieldProps {
  type: string;
}

export interface IPasswordFieldProps extends ISharedFieldProps {
  showable?: boolean;
}

export interface ITextFieldProps extends ISharedFieldProps {}