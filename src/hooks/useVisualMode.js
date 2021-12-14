import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (val, replace = false) => {
    if (replace) {
      history.pop(history.length - 1);
      setMode(history[history.length - 1]);
    }
    history.push(val);
    setMode(val);
  };

  const back = () => {
    if (history.length - 1 >= 1) {
      history.pop(history.length - 1);
      setMode(history[history.length - 1]);
    }
  };
  return { mode, transition, back };
}
