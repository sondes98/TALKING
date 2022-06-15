import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, register } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = ({ socketSetup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({});
  const user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(clearErrors());
    if (user.isAuth) {
      navigate("/profile");
      socketSetup();
    } else {
      navigate("/register");
    }
  }, [user.isAuth, dispatch, navigate, socketSetup]);
  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(userInput));
  };
  return (
    <form>
      <input
        type="text"
        placeholder="full name"
        name="fullName"
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="email"
        name="email"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="password"
        name="password"
        onChange={handleChange}
      />
      <button type="submit" onClick={handleSubmit}>
        Login
      </button>
      {user && user.registerErrors && <p>{user.registerErrors} </p>}
    </form>
  );
};

export default RegisterPage;
