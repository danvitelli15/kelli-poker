import { FC, FormEvent, useCallback, useState } from "react";
import { EmailField, Form, PasswordField, TextField } from "../../components";

interface ICreateAccountFormData {
  email: string;
  firstName: string;
  handle: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
}

export const CreateAccountPage = () => {
  const onSubmit = useCallback((form: ICreateAccountFormData, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(form);
  }, []);

  return (
    <main>
      <h1>Create Account</h1>
      <Form onSubmit={onSubmit}>
        <EmailField identifier="email" label="Email" />
        <TextField identifier="firstName" label="First Name" />
        <TextField identifier="lastName" label="Last Name" />
        <TextField identifier="handle" label="Handle" />
        <br />
        <PasswordField identifier="password" label="Password" />
        <PasswordField identifier="confirmPassword" label="Confirm Password" />
      </Form>
    </main>
  );
};

export default CreateAccountPage;
