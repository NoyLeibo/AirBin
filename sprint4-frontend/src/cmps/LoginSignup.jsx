import { useState, useEffect } from "react";
import { userService } from "../services/user.service";
import { ImgUploader } from "./ImgUploader";
import { useSelector } from "react-redux";
import { login, signup } from "../store/user.actions";

export function LoginSignup(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const user = useSelector((storeState) => storeState.userModule.user);

  // useEffect(() => {
  //   loadUsers();
  // }, []);

  // async function loadUsers() {
  //   const users = await userService.getUsers();
  //   setUsers(users);
  // }

  function clearState() {
    setCredentials({ username: "", password: "", fullname: "", imgUrl: "" });
    setIsSignup(false);
  }

  function handleChange(ev) {
    const field = ev.target.name;
    const value = ev.target.value;
    setCredentials({ ...credentials, [field]: value });
  }

  function onLogin(ev) {
    ev.preventDefault();
    if (!username || !password) return;
    login({ username, password });
    console.log(password);
    // props.onLogin(credentials);
    // clearState();
  }
  async function demoLogin(ev) {
    ev.preventDefault();
    await signup({ username: "Guest", password: "123123" });
  }

  function onSignup(ev = null) {
    if (ev) ev.preventDefault();
    if (!credentials.username || !credentials.password || !credentials.fullname)
      return;
    props.onSignup(credentials);
    clearState();
  }

  if (user) {
    return <></>;
  }
  return (
    <div className="card">
      <div className="login-signup">
        <div className="form-container">
          <h3>Log in or sign up to book</h3>
          <section>
            <div>
              <input
                value={username}
                name="username"
                id="username"
                type="text"
                placeholder="Enter username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button className="login-btn" onClick={onLogin}>
              Login
            </button>
          </section>

          <div
            role="separator"
            className="section-divider--horizontal section-divider"
          >
            <div>or</div>
          </div>
          <section className="demo-signup-section">
            <button className="divider" onClick={demoLogin}>
              Demo login
            </button>
            <button className="divider">Sign up</button>
          </section>
        </div>
      </div>
    </div>
  );
  // <div className="login-page">
  //   <p>
  //     <button className="btn-link" onClick={toggleSignup}>
  //       {!isSignup ? "Signup" : "Login"}
  //     </button>
  //   </p>
  //   {!isSignup && (
  //     <form className="login-form" onSubmit={onLogin}>
  //       <select
  //         name="username"
  //         value={credentials.username}
  //         onChange={handleChange}
  //       >
  //         <option value="">Select User</option>
  //         {users.map((user) => (
  //           <option key={user._id} value={user.username}>
  //             {user.fullname}
  //           </option>
  //         ))}
  //       </select>
  //       <input
  //         type="text"
  //         name="username"
  //         value={username}
  //         placeholder="Username"
  //         onChange={handleChange}
  //         required
  //         autoFocus
  //       />
  //       <input
  //         type="password"
  //         name="password"
  //         value={password}
  //         placeholder="Password"
  //         onChange={handleChange}
  //         required
  //       />
  //       <button>Login!</button>
  //     </form>
  //   )}
  //   <div className="signup-section">
  //     {isSignup && (
  //       <form className="signup-form" onSubmit={onSignup}>
  //         <input
  //           type="text"
  //           name="fullname"
  //           value={credentials.fullname}
  //           placeholder="Fullname"
  //           onChange={handleChange}
  //           required
  //         />
  //         <input
  //           type="text"
  //           name="username"
  //           value={credentials.username}
  //           placeholder="Username"
  //           onChange={handleChange}
  //           required
  //         />
  //         <input
  //           type="password"
  //           name="password"
  //           value={credentials.password}
  //           placeholder="Password"
  //           onChange={handleChange}
  //           required
  //         />
  //         <ImgUploader onUploaded={onUploaded} />
  //         <button>Signup!</button>
  //       </form>
  //     )}
  //   </div>
  // </div>
}
