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
    <div className="container">
      <h1>Login</h1>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input
          value={form.email}
          onChange={updateForm("email")}
          type="text"
          className="form-control"
          name="email"
          id="email"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password:</label>
        <input
          value={form.password}
          onChange={updateForm("password")}
          type="password"
          className="form-control"
          name="password"
          id="password"
        />
      </div>
      <Button className="btn btn-primary" onClick={login}>Login</Button>
    </div>
  );
}
