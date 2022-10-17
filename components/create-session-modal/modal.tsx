import { DateField, Form, SubmitButton, TextField } from "../forms";

export const CreateSessionModal = () => {
  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createSessionModal">
        Create
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
                New Session
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <Form onSubmit={() => null}>
              <div className="modal-body">
                <TextField identifier="title" label="Title" />
                <DateField identifier="date" label="Date" />
              </div>
              <div className="modal-footer">
                <SubmitButton className="btn btn-primary">Create</SubmitButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
