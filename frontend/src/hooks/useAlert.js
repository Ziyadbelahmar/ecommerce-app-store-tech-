import { useState } from "react";

export function useAlert() {
  const [alert, setAlert] = useState(null);

  const showAlert = ({ type = "error", title, message }) => {
    setAlert({ type, title, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return { alert, showAlert, closeAlert };
}
