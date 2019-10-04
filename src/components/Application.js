import React, {useState, useEffect} from "react";
import axios from "axios";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors"

import "components/Application.scss";

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  
  const setDay = day => setState({...state, day})

  useEffect(() => {
    let promiseOne =  axios
    .get(`http://localhost:8001/api/days`)
  
    let promiseTwo = axios
    .get(`http://localhost:8001/api/appointments`)

    let promiseThree = axios
    .get(`http://localhost:8001/api/interviewers`)
  
    Promise.all([
      promiseOne,
      promiseTwo,
      promiseThree
    ]).then(([days, appointments, interviewers]) => {
      setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}))
    });
  
    }, [])

    function bookInterview(id, interview) {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        setState(prev => ({...prev, appointments }))
      })
    }

    function cancelInterview(id) {
      const appointment = {
        ...state.appointments[id],
        interview: null
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        setState(prev => ({...prev, appointments }))
      })

    }

  const appointments = getAppointmentsForDay(state, state.day);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
         />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { appointments.map((appointment, i)=> {
          return (
          <Appointment
          key={appointment.id}
          id = {appointment.id}
          time = { appointment.time}
          interview = {getInterview(state, appointment.interview)}
          interviewers = {getInterviewersForDay(state, state.day)}
          bookInterview = {bookInterview}
          cancelInterview = {cancelInterview}
          />
          );})}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}


