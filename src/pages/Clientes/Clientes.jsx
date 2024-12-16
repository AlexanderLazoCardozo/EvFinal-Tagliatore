import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "../../api/axios";
const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    dni: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/clientes/actualizarCliente/${editingId}`, form);
        setEditingId(null);
        handleSearch();
      } else {
        await axios.post("/clientes/create-cliente", form);
      }
      setForm({ nombre: "", email: "", telefono: "", dni: "" });
    } catch (err) {
      setError("Error al guardar el cliente");
    }
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditingId(cliente._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/clientes/eliminarCliente/${id}`);
      alert("Cliente eliminado");
      setClientes([]);
    } catch (err) {
      setError("Error al eliminar el cliente");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/clientes/obtenerCliente/${searchId}`);
      console.log("resp", response.data);
      setClientes([response.data]);
    } catch (err) {
      setError("Cliente no encontrado");
    }
  };

  return (
    <Navbar>
      <div class="container-xxl flex-grow-1 container-p-y">
        <h2>Gestión de Clientes</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Formulario para crear o actualizar cliente */}
        <form onSubmit={handleCreateOrUpdate}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
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
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Actualizar Cliente" : "Crear Cliente"}
          </button>
        </form>
        <hr />
        <div className="mb-3">
          <label className="form-label">Buscar Cliente por ID</label>
          <input
            type="text"
            className="form-control"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Ingrese ID del cliente"
          />
          <button className="btn btn-primary mt-2" onClick={handleSearch}>
            Buscar Cliente
          </button>
        </div>

        <h3 className="mt-4">Resultado de la Busqueda del Cliente:</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.dni}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(cliente)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDelete(cliente._id)}
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

export default Clientes;
