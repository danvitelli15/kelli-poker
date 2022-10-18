import { useCallback } from "react";
import useSWR from "swr";
import { validateToken } from "../../data/account";
import { getSession, isOwnedByUser, Session } from "../../data/session";

export const getServerSideProps = async ({ params, req }) => {
  if (req.cookies.jwt) {
    const tokenBodyResult = validateToken(req.cookies.jwt);
    if (tokenBodyResult.isOk()) {
      const isOwnerResult = await isOwnedByUser(params.id, tokenBodyResult.value.id);
      if (isOwnerResult.isOk() && isOwnerResult.value) {
        return { props: { paramID: params.id, isOwner: true } };
      }
    }
  }
  return { props: { paramID: params.id } };
};

const pointOptions = ["1", "2", "3", "5", "8", "13", "21", "FE"];

export const ActiveSessionPage = (props) => {
  const {
    data: session,
    error,
    mutate,
  } = useSWR<Session>(`/api/session/${props.paramID}`, (url) => fetch(url).then((res) => res.json()), {
    refreshInterval: 5000,
  });

  const onSetActiveTicket = useCallback(
    (ticketIndex: number) => () => {
      fetch(`/api/session/${props.paramID}/set-active/${ticketIndex}`, { method: "post" }).then(() => mutate());
    },
    [mutate, props.paramID]
  );

  if (error) return <div>Failed to load</div>;
  if (!session) return <div>Loading...</div>;

  return (
    <>
      <h1>{session.title}</h1>
      <div className="row row-col-2 row-col-md-4 row-col-lg-6 row-col-xl-8">
        {pointOptions.map((pointOption) => (
          <div key={`${pointOption}_select_card`} className="col card text-center m-2" role="button">
            <div className="card-body display-1">{pointOption}</div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col col-xs-12 col-md-6">
          {session.tickets?.map((ticket, index) => (
            <div className="card mb-2" key={`ticket_${ticket.title}_listing`}>
              <div className="card-body row">
                <div className="col">
                  <div className="row">
                    <h4 className="card-title">{ticket.title}</h4>
                  </div>
                  <div className="row">
                    <p className="card-text">
                      <a
                        className=" btn btn-secondary"
                        href={ticket.url.startsWith("http") ? ticket.url : `http://${ticket.url}`}
                      >
                        Go to Jira
                      </a>
                    </p>
                  </div>
                </div>
                {props.isOwner ? (
                  <button
                    className={`btn btn-success col col-2 ${index === session.activeTicketIndex ? "disabled" : ""}`}
                    onClick={onSetActiveTicket(index)}
                  >
                    Active
                  </button>
                ) : index === session.activeTicketIndex ? (
                  <span className="badge col col-2 text-bg-success">Active</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className="col col-xs-12 col-md-6">participants</div>
      </div>
    </>
  );
};

export default ActiveSessionPage;
