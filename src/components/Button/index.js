import React from "react";
import "./styles.css";

const Button = ({ text, onClick, blue, disabled }) => {
   return (
      <button disabled={disabled} className={blue ? "btn btn-blue" : "btn"} onClick={onClick}>{text}</button>
   );
};

export default Button;
