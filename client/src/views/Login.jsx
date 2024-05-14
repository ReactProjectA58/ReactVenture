import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";

export default function Login() {
  const { user, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location.state?.from.pathname || "/");
    }
  }, [user]);

  const login = async () => {
    const { user } = await loginUser(form.email, form.password);
    setAppState({ user, userData: null });
    navigate(location.state?.from.pathname || "/");
  };

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  return (
    <div
      className="container"
      style={{
        marginTop: "-0.7rem",

        position: "fixed",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "15%",
      }}
    >
      <h1
        style={{
          color: "rgb(81, 126, 51)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Login
      </h1>
      <div className="mb-3">
        <input
          placeholder="Email"
          value={form.email}
          onChange={updateForm("email")}
          type="text"
          className="form-control"
          name="email"
          id="email"
          style={{
            marginTop: "-0.7rem",
          }}
        />
      </div>
      <div className="mb-3">
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
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "-0.6rem",
        }}
      >
        <Button className="btn btn-primary" onClick={login}>
          Login
        </Button>
      </div>
    </div>
  );
}
