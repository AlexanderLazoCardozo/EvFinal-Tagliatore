import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setToken }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState(true);

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/mesero/crearMesero", {
        name,
        email,
        password,
        estado,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error al crear mesero:", error);
    }
  };

  return (
    <form onSubmit={registerUser}>
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

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
