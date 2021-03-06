import { useEffect, useReducer } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_DAYS
} from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  useEffect(() => {
    let promiseOne = axios.get(`http://localhost:8001/api/days`);

    let promiseTwo = axios.get(`http://localhost:8001/api/appointments`);

    let promiseThree = axios.get(`http://localhost:8001/api/interviewers`);

    Promise.all([promiseOne, promiseTwo, promiseThree]).then(
      ([days, appointments, interviewers]) =>
        dispatch({
          type: SET_APPLICATION_DATA,
          value: [days, appointments, interviewers].map(({ data }) => data)
        })
    );
  }, []);

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
        dispatch({ type: SET_INTERVIEW, value: appointments });
      })
      .then(() => {
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        const day = { ...dayObj, spots: dayObj.spots - 1 };
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day;
          }
          return d;
        });
        if (!state.appointments[id].interview) {
          dispatch({ type: SET_DAYS, days: days });
        }
      });
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
        dispatch({ type: SET_INTERVIEW, value: appointments });
      })
      .then(() => {
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        const day = { ...dayObj, spots: dayObj.spots + 1 };
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day;
          }
          return d;
        });

        dispatch({ type: SET_DAYS, days: days });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
