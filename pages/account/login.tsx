import { FormEvent, useCallback } from "react";
import { EmailField, Form, PasswordField, SubmitButton } from "../../components";

interface ILoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const onSubmit = useCallback((form: ILoginFormData, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("/api/account/login", { body: JSON.stringify(form), method: "POST" }).then((response) =>
      response.status === 200 ? response.json().then((body) => window.location.replace(body.goTo)) : null
    );
  }, []);

  return (
    <main>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <EmailField identifier="email" label="Email" />
        <PasswordField identifier="password" label="Password" />
        <SubmitButton className="btn btn-primary">Login</SubmitButton>
      </Form>
    </main>
  );
};

export default LoginPage;
