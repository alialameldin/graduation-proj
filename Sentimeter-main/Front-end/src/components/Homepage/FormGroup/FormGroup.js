import React, { useEffect, useRef, useState } from "react";
import classes from "./FormGroup.module.css";

const FormGroup = (props) => {
  const [emptyInput, setEmptyInput] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (props.submit) {
      valueChecker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.submit, inputRef]);

  const valueChecker = () => {
    const value = inputRef.current.value.trim();
    if (value === "") {
      setEmptyInput(true);
    } else {
      props.getValue(value);
    }
  };

  const onChangeHandler = () => {
    const value = inputRef.current.value.trim();
    if (value !== "") {
      setEmptyInput(false);
    }
  };

  const enterClickHandler = () => {
    inputRef.current.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        props.enterCLicked("true");

        setTimeout(() => {
          props.enterCLicked("false");
        }, 1000);
      }
    });
  };

  return (
    <div className={[classes.formGroup, props.noPlaceholder ? classes.noPH : null].join(" ")}>
      <label htmlFor={props.name}>{props.children}: </label>
      <input
        ref={inputRef}
        className={emptyInput ? classes.empty : null}
        type={props.type}
        name={props.name}
        placeholder={props.noPlaceholder ? "" : `Enter your ${props.name}`}
        onChange={onChangeHandler}
        onFocus={enterClickHandler}
      />
    </div>
  );
};

export default FormGroup;
