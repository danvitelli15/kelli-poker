import { useCallback } from "react";
import useSWR from "swr";
import { CreateSessionModal } from "../../components/create-session-modal";
import { Account, getAccount, validateToken } from "../../data/account";
import { CreateSessionRequest, getSessionsForUser, Session } from "../../data/session";
import { loggerFactory } from "../../utils/logger";

const logger = loggerFactory("pages/account/profile");

const GET_SESSIONS_URL = "/api/session/user";

export const getServerSideProps = async ({ req }) => {
  const tokenBodyResult = validateToken(req.cookies.jwt);
  if (tokenBodyResult.isErr()) return { redirect: { destination: "/account/login", permanent: false } };

  logger.debug(tokenBodyResult.value);

  const accountResult = await getAccount(tokenBodyResult.value.id);
  if (accountResult.isErr()) return { props: { error: accountResult.error } };

  const sessionsResult = await getSessionsForUser(tokenBodyResult.value.id);
  if (sessionsResult.isErr()) return { props: { error: sessionsResult.error } };

  return { props: { account: accountResult.value, fallback: { [GET_SESSIONS_URL]: sessionsResult.value } } };
};

interface ProfilePageProps {
  account: Account;
  fallback: {};
}

export const ProfilePage = (props: ProfilePageProps) => {
  const { account, fallback } = props;

  const { data: sessionsData, error: sessionsError } = useSWR<Session[]>(GET_SESSIONS_URL, {
    fallback,
    refreshInterval: 15000,
  });

  const createSessionFormSubmit = useCallback(async (sessionInput: { title: string; date: string }) => {
    fetch("/api/session/create", {
      body: JSON.stringify({ title: sessionInput.title, date: new Date(sessionInput.date).toISOString() }),
      method: "POST",
    }).then((res) => res.json().then((data) => window.location.replace(`/session/edit/${data.id}`)));
  }, []);

  return (
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
        {!sessionsData ? (
          <p>Loading sessions...</p>
        ) : sessionsData.length === 0 ? (
          <p>No sessions yet</p>
        ) : (
          <div className="row row-cols-1 row-cols-lg-2">
            {sessionsData.map((session) => (
              <SessionCard key={`${session.id}_card_component`} session={session} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

const SessionCard = ({ session }: { session: Session }) => (
  <div className="card mt-1 text-center" key={`${session.id}_card`}>
    <div className="card-body">
      <h5 className="card-title">{session.title}</h5>
      <h6 className="card-subtitle  mb-2">{new Date(session.date).toLocaleDateString()}</h6>
      <p className="card-text">
        Tickets:
        {session.tickets.map((ticket, index) => (
          <a
            className="badge"
            href={ticket.url.startsWith("http") ? ticket.url : `http://${ticket.url}`}
            key={`${session.id}_ticket-${index}`}
          >
            {ticket.title}
          </a>
        ))}
      </p>
    </div>
    <div className="card-footer">
      <a href={`/session/edit/${session.id}`} className="btn btn-primary mx-1">
        Edit
      </a>
      <button className="btn btn-danger disabled">Delete</button>
      <a href={`/session/${session.id}`} className="btn btn-success mx-1">
        Visit
      </a>
      <button className="btn btn-secondary disabled"> Invite</button>
    </div>
  </div>
);

export default ProfilePage;
