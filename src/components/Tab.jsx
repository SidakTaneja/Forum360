import React, { useState } from "react";
import "./Login.css";
import Message from "./Message.jsx";
import Feedback from "./questions.jsx";
import { generatetoken, RoleComponent } from "./data";
import { setToken, setUserkey } from "./token";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentScreen, setCurrentScreen] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("")
    generatetoken(username, password)
      .then(async (tokendata) => {
        if (tokendata.access_token) {
          setToken(tokendata.access_token);
          setUserkey(tokendata.userKey);
          const role = await RoleComponent(tokendata.access_token, tokendata.userKey)
          if (role === 'cohost') {
            setCurrentScreen("feedback")
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

  if (currentScreen === "feedback") {
    return <Feedback />
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
