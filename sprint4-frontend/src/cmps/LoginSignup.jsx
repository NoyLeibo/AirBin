import { useState, useEffect } from "react";
import { userService } from "../services/user.service";
import { ImgUploader } from "./ImgUploader";

export function LoginSignup(props) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    fullname: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const users = await userService.getUsers();
    setUsers(users);
  }

  function clearState() {
    setCredentials({ username: "", password: "", fullname: "", imgUrl: "" });
    setIsSignup(false);
  }

  function handleChange(ev) {
    const field = ev.target.name;
    const value = ev.target.value;
    setCredentials({ ...credentials, [field]: value });
  }

  function onLogin(ev = null) {
    if (ev) ev.preventDefault();
    if (!credentials.username) return;
    props.onLogin(credentials);
    clearState();
  }

  function onSignup(ev = null) {
    if (ev) ev.preventDefault();
    if (!credentials.username || !credentials.password || !credentials.fullname)
      return;
    props.onSignup(credentials);
    clearState();
  }

  function toggleSignup() {
    setIsSignup(!isSignup);
  }

  function onUploaded(imgUrl) {
    setCredentials({ ...credentials, imgUrl });
  }

  return (
    <div class="card">
      <div class="login-signup">
        <div class="form-container">
          <section>
            <div>
              <input
                name="username"
                id="username"
                type="text"
                placeholder="Enter username"
              />
            </div>

            <div>
              <input type="password" placeholder="Enter password" />
            </div>
            <button className="login-btn">Login</button>
          </section>
          <div
            role="separator"
            class="section-divider--horizontal section-divider"
          >
            <div>or</div>
          </div>
          <section className="demo-signup-section">
            <button className="divider">Demo login</button>
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
