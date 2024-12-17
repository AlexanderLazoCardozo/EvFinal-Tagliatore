import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "../../api/axios";
const Meseros = () => {
  const [meseros, setMeseros] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    estado: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/mesero/actualizarMesero/${editingId}`, form);
        setEditingId(null);
        handleSearch();
      } else {
        await axios.post("/mesero/crearMesero", form);
      }
      setForm({ name: "", email: "", password: "", estado: true });
    } catch (err) {
      console.error("ERR", err);

      setError("Error al guardar el mesero");
    }
  };

  const handleEdit = (mesero) => {
    const { password, ...meseroCrypt } = mesero;
    setForm({ ...meseroCrypt });
    setEditingId(mesero._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/mesero/eliminarMesero/${id}`);
      alert("Mesero eliminado");
      handleSearch();
    } catch (err) {
      setError("Error al eliminar el mesero");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/mesero/obtenerMeseros`);
      setMeseros(response.data);
      console.log("resp", response.data);
    } catch (err) {
      setError("Error al obtener los meseros");
    }
  };
  return (
    <Navbar>
      <div className="container-xxl flex-grow-1 container-p-y">
        <h2>Gestión de Meseros</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleCreateOrUpdate}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="form-control"
              required={!editingId}
              disabled={editingId}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={(e) =>
                setForm({ ...form, estado: e.target.value === "true" })
              }
              className="form-control"
            >
              <option value={true}>Activo</option>
              <option value={false}>Inactivo</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Actualizar Mesero" : "Crear Mesero"}
          </button>
        </form>
        <hr />

        <button className="btn btn-primary" onClick={handleSearch}>
          Cargar Meseros Activos
        </button>

        <h3 className="mt-4">Lista de Meseros:</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {meseros.map((mesero) => (
              <tr key={mesero._id}>
                <td>{mesero.name}</td>
                <td>{mesero.email}</td>
                <td>{mesero.estado ? "Activo" : "Inactivo"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(mesero)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDelete(mesero._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Navbar>
  );
};

export default Meseros;
