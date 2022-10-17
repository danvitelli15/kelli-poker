import { useCallback } from "react";
import { SWRConfig } from "swr";
import { CreateSessionModal } from "../../components/create-session-modal";
import { Account, getAccount, validateToken } from "../../data/account";
import { CreateSessionRequest } from "../../data/session";
import { loggerFactory } from "../../utils/logger";

const logger = loggerFactory("pages/account/profile");

export const getServerSideProps = async ({ req }) => {
  const tokenBodyResult = validateToken(req.cookies.jwt);
  if (tokenBodyResult.isErr()) return { redirect: { destination: "/account/login", permanent: false } };

  logger.debug(tokenBodyResult.value);

  const accountResult = await getAccount(tokenBodyResult.value.id);
  if (accountResult.isErr()) return { props: { error: accountResult.error } };

  return { props: { account: accountResult.value } };
};

interface ProfilePageProps {
  account: Account;
  fallback: {};
}

export const ProfilePage = (props: ProfilePageProps) => {
  const { account, fallback } = props;

  const createSessionFormSubmit = useCallback(async (sessionInput: { title: string; date: string }) => {
    fetch("/api/session/create", {
      body: JSON.stringify({ title: sessionInput.title, date: new Date(sessionInput.date).toISOString() }),
      method: "POST",
    }).then((res) => res.json().then((data) => window.location.replace(`/session/edit/${data.id}`)));
  }, []);

  return (
    <SWRConfig value={fallback}>
      <main>
        <h1>Hi {account.firstName || account.displayName}</h1>
        <section>
          <h2>Your Info</h2>
          <table>
            <tbody>
              <tr>
                <td>email</td>
                <td>{account.email}</td>
              </tr>
              <tr>
                <td>handle</td>
                <td>{account.displayName}</td>
              </tr>
              <tr>
                <td>first name</td>
                <td>{account.firstName}</td>
              </tr>
              <tr>
                <td>last name</td>
                <td>{account.lastName}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2>Your Planning Sessions</h2>
          <CreateSessionModal formSubmit={createSessionFormSubmit} />
          <p>TODO</p>
        </section>
      </main>
    </SWRConfig>
  );
};

export default ProfilePage;
