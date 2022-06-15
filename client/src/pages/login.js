import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ socketSetup }) => {
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
      navigate("/login");
    }
  }, [dispatch, navigate, user.isAuth, socketSetup]);

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userInput));
  };
  return (
    <form>
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
      {user && user.loginErrors && <p>{user.loginErrors} </p>}
    </form>
  );
};

export default LoginPage;
