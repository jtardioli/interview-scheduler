import React from "react";
import "../Appointment/index.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from "./Status";
import Form from "./Form";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const STATUS = "STATUS";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(STATUS);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    });
  }

  function deleteInterview() {
    transition(STATUS);
    props.cancelInterview(props.id).then(() => {
      transition(EMPTY);
    });
  }

  const onDelete = () => {
    transition(CONFIRM);
  };
  const onCancel = () => {
    transition(SHOW);
  };
  const onEdit = () => {
    transition(EDIT);
  };

  return (
    <article className="appointment">
      {props.time ? <Header time={props.time} /> : "No Appointments"}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      {mode === CREATE && (
        <Form
          onCancel={() => {
            transition(EMPTY);
          }}
          onSave={save}
          interviewers={props.interviewers}
        />
      )}
      {mode === EDIT && (
        <Form
          onCancel={() => {
            transition(SHOW);
          }}
          onSave={save}
          interviewers={props.interviewers}
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === STATUS && <Status />}
      {mode === CONFIRM && (
        <Confirm
          onConfirm={deleteInterview}
          onCancel={onCancel}
          message="Are you sure you'd like to delete?"
        />
      )}
    </article>
  );
}
