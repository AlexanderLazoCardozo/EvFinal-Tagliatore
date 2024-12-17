import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Clientes from "./pages/Clientes/Clientes";
import Categoria from "./pages/Categorias/Categoria";
import Ordenes from "./pages/Ordenes/Ordenes";
import Meseros from "./pages/Meseros/Meseros";
import Platillos from "./pages/Platillos/Platillos";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute>
                <Categoria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordenes"
            element={
              <ProtectedRoute>
                <Ordenes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meseros"
            element={
              <ProtectedRoute>
                <Meseros />
              </ProtectedRoute>
            }
          />
          <Route
            path="/platillos"
            element={
              <ProtectedRoute>
                <Platillos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
