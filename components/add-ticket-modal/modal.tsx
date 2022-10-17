import { TicketType } from "../../data/session";
import { Form, SelectField, SubmitButton, TextField } from "../forms";

export const AddTicketModal = ({ formSubmit }) => (
  <>
    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createSessionModal">
      Add
    </button>

    <div
      className="modal fade"
      id="createSessionModal"
      tabIndex={-1}
      aria-labelledby="createSessionModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createSessionModalLabel">
              Add Ticket
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <Form onSubmit={formSubmit}>
            <div className="modal-body">
              <TextField identifier="title" label="Title" />
              <TextField identifier="url" label="URL" />
            </div>
            <div className="modal-footer">
              <SubmitButton className="btn btn-primary" data-bs-dismiss="modal">
                Create
              </SubmitButton>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </>
);
