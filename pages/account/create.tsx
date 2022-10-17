import { FC, FormEvent, useCallback, useState } from "react";
import { EmailField, Form, PasswordField, SubmitButton, TextField } from "../../components";

interface ICreateAccountFormData {
  email: string;
  firstName: string;
  handle: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
}

export const CreateAccountPage = () => {
  const [isMatching, setIsMatching] = useState(true);

  const onSubmit = useCallback((form: ICreateAccountFormData, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.password !== form.passwordConfirmation) {
      setIsMatching(false);
      return;
    }
    fetch("/api/account/create", { body: JSON.stringify(form), method: "POST" }).then((response) =>
      response.status === 200 ? response.json().then((body) => window.location.replace(body.goTo)) : null
    );
  }, []);

  return (
    <main>
      <h1>Create Account</h1>
      <Form onSubmit={onSubmit}>
        <EmailField identifier="email" label="Email" />
        <TextField identifier="firstName" label="First Name" />
        <TextField identifier="lastName" label="Last Name" />
        <TextField identifier="displayName" label="Display Name" />
        <br />
        {!isMatching && <p>Passwords do not match</p>}
        <PasswordField identifier="password" label="Password" />
        <PasswordField identifier="confirmPassword" label="Confirm Password" />
        <SubmitButton className="btm btn-primary">Create Account</SubmitButton>
      </Form>
    </main>
  );
};

export default CreateAccountPage;
