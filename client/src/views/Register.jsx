import { useContext, useState } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";
import { BASE } from "../common/constants";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const { user, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  if (user) {
    navigate(`${BASE}`);
  }

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const register = async () => {
    try {
      if (form.firstName.length < 1) {
        window.alert("First name cannot be empty!");
        return;
      } else if (form.firstName.length < 4 || form.firstName.length > 32) {
        window.alert("First name must be between 4 and 32 characters.");
        return;
      }

      if (form.lastName.length < 1) {
        window.alert("Last name cannot be empty!");
        return;
      } else if (form.lastName.length < 4 || form.lastName.length > 32) {
        window.alert("Last name must be between 4 and 32 characters.");
        return;
      }

      if (!form.username && !form.email) {
        window.alert("Please provide either a username or an email.");
        return;
      }

      if (form.username) {
        const userByHandle = await getUserByHandle(form.username);
        if (userByHandle.exists()) {
          window.alert("User with this username already exists!");
          return;
        }
      }

      if (form.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          window.alert("Invalid email address.");
          return;
        }
      }

      if (form.password.length === 0) {
        window.alert("Password cannot be empty!");
        return;
      } else if (form.password.length < 6) {
        window.alert("Password must be at least 6 characters long.");
        return;
      }

      const credential = await registerUser(form.email, form.password);
      await createUserHandle(
        form.firstName,
        form.lastName,
        form.username || form.email, // Use username if available, otherwise use email
        credential.user.uid,
        credential.user.email
      );
      setAppState({ user: credential.user, userData: null });
      navigate(`${BASE}`);
    } catch (error) {
      if (error.message.includes("auth/email-already-in-use")) {
        window.alert("User has already been registered!");
      }
    }
  };

  return (
    <div
      className="container"
      style={{
        position: "absolute",
        top: "50%",
        left: "49%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          color: "rgb(81, 126, 51)",
          position: "relative",
          zIndex: "999",
        }}
      >
        Register
      </h1>

      <div
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={updateForm("firstName")}
          type="text"
          className="form-control"
          name="firstName"
          id="firstName"
          style={{ marginTop: "-0.7rem", width: "20%" }}
        />
      </div>

      <div
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={updateForm("lastName")}
          type="text"
          className="form-control"
          name="lastName"
          id="lastName"
          style={{
            marginTop: "-0.7rem",
            width: "20%",
          }}
        />
      </div>

      <div
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="Username"
          value={form.username}
          onChange={updateForm("username")}
          type="text"
          className="form-control"
          name="username"
          id="username"
          style={{
            marginTop: "-0.7rem",
            width: "20%",
          }}
        />
      </div>

      <div
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="Email"
          value={form.email}
          onChange={updateForm("email")}
          type="email"
          className="form-control"
          name="email"
          id="email"
          style={{
            marginTop: "-0.7rem",
            width: "20%",
          }}
        />
      </div>

      <div
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="Password"
          value={form.password}
          onChange={updateForm("password")}
          type="password"
          className="form-control"
          name="password"
          id="password"
          style={{
            marginTop: "-0.7rem",
            width: "20%",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "-0.7rem",

          display: "flex",
          justifyContent: "center",
        }}
      >
        <button className="btn btn-primary" onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
}
