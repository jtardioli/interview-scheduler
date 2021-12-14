export function getAppointmentsForDay(state, day) {
  const currDay = state.days.filter((myDay) => {
    return myDay.name === day;
  })[0];
  if (!currDay) {
    return [];
  }

  const currDayAppointments = [];
  for (let appID of currDay.appointments) {
    if (state.appointments[appID]) {
      currDayAppointments.push(state.appointments[appID]);
    }
  }

  return currDayAppointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerData = state.interviewers[interview.interviewer];
  return {
    student: interview.student,
    interviewer: interviewerData,
  };
}

export function getInterviewersForDay(state, day) {
  const currDay = state.days.filter((myDay) => {
    return myDay.name === day;
  })[0];
  if (!currDay) {
    return [];
  }

  const currDayInterviewers = [];
  for (let IntID of currDay.interviewers) {
    if (state.interviewers[IntID]) {
      currDayInterviewers.push(state.interviewers[IntID]);
    }
  }

  return currDayInterviewers;
}
