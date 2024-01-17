import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/user.service";
import { login, logout, signup } from "../store/user.actions";

export function LoginModal({ isLoginOpen, setIsLoginOpen, signUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [isRegistering, setIsRegistering] = useState(signUp);

  const demoLogin = async () => {
    try {
      await login({ username: "demo_user", password: "123456" });
      refreshPage();
      setIsLoginOpen(false);
    } catch (err) {
      console.log("err: " + err);
    }
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      // await logout();
      await login({ username, password });
      refreshPage();
      setIsLoginOpen(false);
    } catch (err) {
      console.log("err: " + err);
      if (!userService.getLoggedinUser()) {
        alert("Wrong username or password, please try again!");
      }
    } finally {
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    console.log("register");
    try {
      await userService.signup({
        fullname,
        username,
        password,
        // imgUrl,
      });
      refreshPage();
    } catch (err) {
      console.log("Registration failed:", err);
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="login-modal">
      <div className="login-modal-title flex align-center justify-center bold">
        {isRegistering ? "Signup" : "Login"}
      </div>
      <div className="modal-divider"></div>

      <div className="flex column padding24">
        <div>Welcome to Airbmb</div>
        <form
          className="flex column"
          onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
        >
          {isRegistering && (
            <div className="input-group">
              <label htmlFor="Fullname">
                <span className="red">*</span> Fullname
              </label>
              <input
                type="text"
                id="Fullname"
                name="Fullname"
                required
                minLength="3"
                maxLength="20"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="username">
              <span className="red">*</span> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              minLength="3"
              maxLength="20"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <span className="red">*</span> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength="6"
              maxLength="20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={toggleForm}
          >
            {isRegistering
              ? "Already a member? Login"
              : "Not a member? Register"}
          </button>

          {isRegistering && (
            <button
              type="button"
              className="demo-login-button"
              onClick={handleRegisterSubmit}
            >
              Register
            </button>
          )}

          {!isRegistering && (
            <button
              type="button"
              className="demo-login-button"
              onClick={handleLoginSubmit}
            >
              Log In
            </button>
          )}
          {!isRegistering && (
            <button
              type="button"
              className="demo-login-button"
              onClick={demoLogin}
            >
              Demo Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
