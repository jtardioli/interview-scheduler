import React, { useEffect } from "react";
import "../Appointment/index.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from "./Status";
import Form from "./Form";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const STATUS = "STATUS";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

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
    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((error) => {
        transition(ERROR_SAVE, true);
      });
  }

  function deleteInterview() {
    transition(STATUS);
    props
      .cancelInterview(props.id)
      .then(() => {
        console.log("hi");
        transition(EMPTY);
      })
      .catch(() => {
        transition(ERROR_DELETE, true);
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

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [mode, props.interview, transition]);

  return (
    <article className="appointment">
      {props.time ? <Header time={props.time} /> : "No Appointments"}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
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
      {mode === ERROR_SAVE && <Error onClose={back} />}
      {mode === ERROR_DELETE && (
        <Error
          onClose={() => {
            transition(SHOW);
          }}
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
