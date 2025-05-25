import React, { useEffect, useState } from "react";

const FlashMessage = ({ type, message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const styles = {
    container: {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      borderRadius: "5px",
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      opacity: 1,
      transition: "opacity 0.5s ease-in-out",
      backgroundColor: type === "success" ? "#28a745" : "#dc3545",
    },
  };

  return <div style={styles.container}>{message}</div>;
};

export default FlashMessage;
