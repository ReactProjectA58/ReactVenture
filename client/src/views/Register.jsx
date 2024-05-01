import { useContext, useState } from "react"
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const { user, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  if (user) {
    navigate('/');
  }

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const register = async() => {
    // TODO: validate form data
    try {
      const user = await getUserByHandle(form.username);
      if (user.exists()) {
        return console.log('User with this username already exists!');
      }
      const credential = await registerUser(form.email, form.password);
      await createUserHandle(form.username, credential.user.uid, credential.user.email);
      setAppState({ user: credential.user, userData: null });
      navigate('/');
    } catch (error) {
      if (error.message.includes('auth/email-already-in-use')) {
        console.log('User has already been registered!');
      }
    }
  };

  return (<div>
    <h1>Register</h1>
    <label htmlFor="username">Username:</label><input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" /><br/>
    <label htmlFor="email">Email:</label><input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" /><br/>
    <label htmlFor="password">Password:</label><input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" /><br/><br/>
    <button onClick={register}>Register</button>
  </div>)
}