import { useReducer, useEffect } from "react";
import axios from "axios";
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
  });

  // function updateSpots(increment) {
  //   const days = [...state.days];

  //   for (let day of days) {
  //     if (day.name === state.day) {
  //       day.spots += increment;
  //     }
  //   }

  //   return days;
  // }

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers,
        };
      case SET_INTERVIEW: {
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview,
        };

        const appointments = {
          ...state.appointments,
          [action.id]: appointment,
        };

        // if (action.interview === null) {
        //   days = updateSpots(1);
        // } else {
        //   days = updateSpots(-1);
        // }
        return {
          ...state,
          appointments,
        };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = (day) => dispatch({ type: SET_DAY, day });
  //setState({ ...state, day };)

  function bookInterview(id, interview) {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview },
    // };

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment,
    // };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview });
        // setState({
        //   ...state,
        //   appointments,
        //   days: updateSpots(-1),
        // });
      });
  }

  function cancelInterview(id) {
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
      });
  }
  //cancelInterview(3);
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = function (event) {
      webSocket.send("ping");
    };
    webSocket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === "SET_INTERVIEW") {
        dispatch({
          type: SET_INTERVIEW,
          id: data.id,
          interview: data.interview,
        });
      }
    };
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({
        type: SET_APPLICATION_DATA,
        days,
        appointments,
        interviewers,
      });
    });

    const cleanUp = () => {
      webSocket.close();
    };
    return cleanUp;
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
