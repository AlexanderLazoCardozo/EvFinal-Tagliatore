import React from "react";
import axios from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/mesero/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={loginUser}>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;
