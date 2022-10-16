import { FormEvent, useCallback } from "react";
import { EmailField, Form, PasswordField } from "../../components";

interface ILoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const onSubmit = useCallback((form: ILoginFormData, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("/api/account/login", { body: JSON.stringify(form), method: "POST" }).then((response) =>
      response.json().then((body) => console.log(body))
    );
  }, []);

  return (
    <main>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <EmailField identifier="email" label="Email" />
        <PasswordField identifier="password" label="Password" />
      </Form>
    </main>
  );
};

export default LoginPage;
