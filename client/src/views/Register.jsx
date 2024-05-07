import { useContext, useState } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";

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
    navigate("/");
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
      navigate("/");
    } catch (error) {
      if (error.message.includes("auth/email-already-in-use")) {
        window.alert("User has already been registered!");
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <label htmlFor="firstName">First Name:</label>
      <input
        value={form.firstName}
        onChange={updateForm("firstName")}
        type="text"
        name="firstName"
        id="firstName"
      />
      <br />
      <label htmlFor="lastName">Last Name:</label>
      <input
        value={form.lastName}
        onChange={updateForm("lastName")}
        type="text"
        name="lastName"
        id="lastName"
      />
      <br />

      <label htmlFor="username">Username:</label>
      <input
        value={form.username}
        onChange={updateForm("username")}
        type="text"
        name="username"
        id="username"
      />
      <br />
      <label htmlFor="email">Email:</label>
      <input
        value={form.email}
        onChange={updateForm("email")}
        type="text"
        name="email"
        id="email"
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        value={form.password}
        onChange={updateForm("password")}
        type="password"
        name="password"
        id="password"
      />
      <br />
      <br />
      <button onClick={register}>Register</button>
    </div>
  );
}
