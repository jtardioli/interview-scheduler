import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (val, replace = false) => {
    if (replace) {
      const fake = [...history];
      fake.pop(history.length - 1);
      setHistory([...fake]);
      setMode(history[history.length - 1]);
    }
    history.push(val);
    setHistory((prev) => [...prev, val]);
    setMode(val);
  };

  const back = () => {
    if (history.length - 1 >= 1) {
      const fake = [...history];
      fake.pop(history.length - 1);
      setHistory([...fake]);
      setMode(history[history.length - 1]);
    }
  };
  return { mode, transition, back };
}
