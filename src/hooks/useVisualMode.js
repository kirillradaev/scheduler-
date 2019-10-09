import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(nextMode, replace = false) {
    if (!replace) {
      setMode(nextMode);
      setHistory([...history, nextMode]);
    } else {
      setMode(nextMode);
      history.pop();
      setHistory([...history, nextMode]);
    }
  }
  function back() {
    if (history.length > 1) history.pop();
    setHistory(history);
    setMode(history[history.length - 1]);
  }

  return { mode, transition, back };
}
