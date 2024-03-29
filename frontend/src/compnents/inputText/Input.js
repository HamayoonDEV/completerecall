import React from "react";
import styles from "./Input.module.css";

const Input = (props) => {
  return (
    <div className={styles.main}>
      <input {...props} />
      {props.error && <p>{props.errormessage}</p>}
    </div>
  );
};

export default Input;
