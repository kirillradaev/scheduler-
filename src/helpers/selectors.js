export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find(item => item.name === day);
  if (!filteredDay) {
    return [];
  }
  const appointments = filteredDay.appointments.map(item => {
    return state.appointments[item];
  });

  return appointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  } else {
    const interviewerID = interview.interviewer;
    return {
      student: interview.student,
      interviewer: state.interviewers[interviewerID]
    };
  }
}

export function getInterviewersForDay(state, day) {
  const filteredDay = state.days.filter(item => item.name === day);
  if (!filteredDay.length) {
    return [];
  }
  const interviewersID = filteredDay[0].interviewers;
  const interviewers = [];
  for (let id of interviewersID) {
    interviewers.push(state.interviewers[id]);
  }
  return interviewers;
}
