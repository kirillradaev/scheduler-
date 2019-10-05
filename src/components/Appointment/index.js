import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode  from "hooks/useVisualMode";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CANCEL = "CANCEL";
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
      interviewer
    };
    // if(!props.interview.name) {
    //  back()
    // }
    transition(SAVING)
    props.bookInterview (props.id, interview)
    .then(() => {
      transition(SHOW)
    })
    .catch((error) => {
      transition(ERROR_SAVE, true)
    })

  }

  function destroy() {
     transition(CANCEL)
     props.cancelInterview (props.id)
     .then(() => {
      transition(EMPTY)
     })
     .catch((error) => {
      transition(ERROR_DELETE, true)
    })
  }

 


  return (
  <article className="appointment">
    <Header time={props.time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
     <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
    onDelete={() => transition(CONFIRM)}
    onEdit={() => transition(EDIT)}
  />
    )}
    { mode === CREATE && <Form onCancel={() => back()} interviewers={props.interviewers} onSave={save}  />}
    { mode === SAVING && <Status message={"Creating a new booking"}/>}
    { mode === CONFIRM && <Confirm message={"Are you sure you would like to delete this booking?"} onCancel={() => back()} onConfirm={destroy}/>}
    { mode === CANCEL && <Status message={"Deleting"} />}
    { mode === EDIT && 
    <Form 
    name={props.interview.student} 
    interviewer={props.interview.interviewer.id}
    interviewers={props.interviewers}
    onCancel={() => back()}
    onSave={save}
    />
    }
    { mode === ERROR_SAVE && <Error message={"Ooops, something went wrong ;("} onClose={()=> back()} />}
    { mode === ERROR_DELETE && <Error message={"Ooops, something went wrong ;("} onClose={()=> back()} />}  
  </article>
  )
}

