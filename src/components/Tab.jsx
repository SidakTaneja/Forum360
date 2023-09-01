import React, { useState } from "react";
import "./Login.css";
import Message from "./Message.jsx";
import Agenda from "./Agenda.jsx";
import { generatetoken, RoleComponent } from "./data";
import { setToken, setUserkey, setRole, setSessionId, setEventKey } from "./token";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eventkey, _setEventkey] = useState("");
  const [sessionid, _setSessionid] = useState("");
  const [currentScreen, setCurrentScreen] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleEventkeyChange(event) {
    _setEventkey(event.target.value);
  }

  function handleSessionidChange(event) {
    _setSessionid(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("")
    // console.log(sessionid, eventkey)
    setSessionId(sessionid);
    setEventKey(eventkey);
    generatetoken(username, password)
      .then(async (tokendata) => {
        if (tokendata.access_token) {
          setToken(tokendata.access_token);
          setUserkey(tokendata.userKey);
          console.log(tokendata.access_token, tokendata.userKey, sessionid)
          const role = await RoleComponent(tokendata.access_token, tokendata.userKey, sessionid);
          setRole(role)

          if (role === 'cohost') {
            setCurrentScreen("agenda")
          }
          else {
            setCurrentScreen("messaging");
          }
          setErrorMessage("");
        } else {
          setErrorMessage("Username or password is incorrect");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.error_description);
        } else {
          setErrorMessage("Username or password is incorrect");
        }
      });
  }

  if (currentScreen === "messaging") {
    return <Message />;
  }

  if (currentScreen === "agenda") {
    return <Agenda />;
  }

  return (
    <div className="main">
      <h1 className="login-heading">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
          className="login-input"
        />
        <input
          type="text"
          value={eventkey}
          onChange={handleEventkeyChange}
          placeholder="Event Key"
          className="login-input"
        />
        <input
          type="text"
          value={sessionid}
          onChange={handleSessionidChange}
          placeholder="Session ID"
          className="login-input"
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
