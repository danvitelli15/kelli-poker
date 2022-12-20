import { useCallback, useState } from "react";
import { DateField, Form, SubmitButton, TextField } from "../../../components";
import { AddTicketModal } from "../../../components/add-ticket-modal";
import { validateToken } from "../../../data/account";
import {
  getSession,
  isOwnedByUser,
  Session,
  Ticket,
} from "../../../data/session";
import { AddTicketRequest } from "../../../data/session/create-session-request.dto";
import { loggerFactory } from "../../../utils/logger";

const logger = loggerFactory("session/edit/[id]");

export const getServerSideProps = async ({ params, req }) => {
  const tokenBodyResult = validateToken(req.cookies.jwt);
  if (tokenBodyResult.isErr())
    return { redirect: { destination: "/account/login", permanent: false } };

  logger.debug(tokenBodyResult.value);
  logger.debug(params.id);

  const isOwnerResult = await isOwnedByUser(
    params.id,
    tokenBodyResult.value.id
  );
  if (isOwnerResult.isErr())
    return { redirect: { destination: "/account/profile", permanent: false } };
  if (!isOwnerResult.value)
    return { redirect: { destination: "/account/profile", permanent: false } };

  const sessionResult = await getSession(params.id);
  if (sessionResult.isErr()) return { props: { error: sessionResult.error } };

  return { props: { id: params.id, session: sessionResult.value } };
};

export const CreatePlanningSessionPage = (props: {
  id: string;
  session: Session;
}) => {
  const [sessionDetails, setSessionDetails] = useState({
    title: props.session.title,
    date: props.session.date.split("T")[0],
  });
  const [tickets, setTickets] = useState(props.session.tickets);

  const onAddTicketSubmit = useCallback(
    async (ticketInput: AddTicketRequest) => {
      fetch(`/api/session/${props.id}/add-ticket`, {
        body: JSON.stringify(ticketInput),
        method: "post",
      }).then((res) =>
        res.json().then(() =>
          setTickets((existing) => [
            ...existing,
            {
              title: ticketInput.title,
              url: ticketInput.url,
              votes: {},
            } as Ticket,
          ])
        )
      );
    },
    [props.id]
  );

  const onRemoveTicketClick = useCallback(
    (index) => () => {
      console.log("remove ticket", index);
      const commitDelete = confirm("Are you sure want to delete?");
      if (commitDelete) {
        fetch(`/api/session/${props.id}/delete-ticket`, {
          body: JSON.stringify(index),
          method: "post",
        }).then((res) =>
          res.json().then(() => {
            // Remove the ticket from the list 'tickets' [1, 2, 3, 4, 5] => [1, 2, 4, 5]
            setTickets((existing) =>
              existing.filter((ticket, ticketIndex) => index !== ticketIndex)
            );
            console.log(tickets);
          })
        );
      }
    },
    []
  );

  /*
    Add a remove button to cards
    1. Add something that you click to remove, big red button
    2. Confirmation prompt
    3. Get our current session
    4. Remove the ticket from the session

    Tickets don't have IDs, so we need to either add ids to them, or figure out how to remove them by index
  */
  return (
    <main>
      <h1>New Planning Session</h1>
      <section>
        <h2>Session Details</h2>
        <Form onSubmit={() => null}>
          <TextField
            identifier="title"
            label="Title"
            value={sessionDetails.title}
          />
          <DateField
            identifier="date"
            label="Date"
            value={sessionDetails.date}
          />
          <SubmitButton className="btn btn-primary disabled">
            Update
          </SubmitButton>
        </Form>
      </section>
      <section>
        <h2>Tickets</h2>
        <AddTicketModal formSubmit={onAddTicketSubmit} />
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
          {tickets.map((ticket, index) => (
            <div key={`ticket-${index}-card`} className="col">
              <div className="card mb-2">
                <div className="card-body">
                  <Form key={`ticket-${index}-form`} onSubmit={() => null}>
                    <TextField
                      identifier={`ticket-${index}-title`}
                      label="Title"
                      value={ticket.title}
                    />
                    <TextField
                      identifier={`ticket-${index}-url`}
                      label="URL"
                      value={ticket.url}
                    />
                    <br />
                    <button
                      className="btn btn-danger"
                      onClick={onRemoveTicketClick(index)}
                    >
                      Remove
                    </button>
                    {/* <SubmitButton className="btn btn-primary disabled">Update</SubmitButton> */}
                  </Form>
                </div>
              </div>
            </div>
          ))}
        </div>
        <br />
      </section>
    </main>
  );
};

export default CreatePlanningSessionPage;
