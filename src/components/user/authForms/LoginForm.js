import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-ctx";
import useInput from "../../../hooks/use-input";
import AuthFormLayout from "../../../UIs/authFormLayout/AuthFormLayout";
import Input from "../../../UIs/Input/Input";
import Loader from "../../../UIs/loader/Loader";
import Model from "../../../UIs/Model/Model";
import Notification from "../../../UIs/notification/Notification";
import style from "./LoginForm.module.scss";

export default function LoginForm() {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const {
    userInput: emailInput,
    userInputIsValid: emailInputIsValid,
    hasError: emailInputHasError,
    userInputChangeHandler: emailChangeHandler,
    userInputBlurHandler: emailBlurHandler,
  } = useInput((value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
  );
  const {
    userInput: passwordInput,
    userInputIsValid: passwordInputIsValid,
    hasError: passwordInputHasError,
    userInputChangeHandler: passwordChangeHandler,
    userInputBlurHandler: passwordBlurHandler,
  } = useInput((value) => value.trim().length > 6);

  let formIsValid = false;
  if (emailInputIsValid && passwordInputIsValid) {
    formIsValid = true;
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formIsValid) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DOMAIN_NAME}/api/v1/users/login`,
        {
          method: "POST",
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const { token, data } = await response.json();
      setNotification({ status: "success", message: "Loggedin Successfully!" });
      setTimeout(() => {
        setNotification(null);
        authCtx.setToken(token);
        authCtx.setUser(data.user);
        navigate("/");
      }, 2000);
    } catch (err) {
      setNotification({ status: "fail", message: err.message });
      setTimeout(() => setNotification(null), 2000);
    }
    setIsLoading(false);
  };

  const emailInputClasses = emailInputHasError ? "invalid" : "";

  const passwordInputClasses = passwordInputHasError ? "invalid" : "";

  if (isLoading)
    return (
      <Model>
        <Loader />
      </Model>
    );

  return (
    <div className={style["login-form"]}>
      {notification && <Notification notification={notification} />}
      <AuthFormLayout
        onSubmit={formSubmitHandler}
        authFormTitle="PLEASE LOGIN"
        authFormBtn="Login"
        formIsValid={formIsValid}
        isLogginIn = {true}
      >
        <Input
          className={emailInputClasses}
          type="email"
          id="user-email"
          name="user-email"
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          value={emailInput}
          label="Email"
        />

        <Input
          className={passwordInputClasses}
          type="password"
          id="user-password"
          name="user-password"
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          value={passwordInput}
          label="Password"
        />
      </AuthFormLayout>
    </div>
  );
}
