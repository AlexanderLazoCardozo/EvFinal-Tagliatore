import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "../../api/axios";

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [form, setForm] = useState({
    idMesa: "",
    Platillos: [
      {
        nombre: "",
        cantidad: "",
      },
    ],
    Estado: "pendiente",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [searchIdMesa, setSearchIdMesa] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePlatilloChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPlatillos = [...form.Platillos];
    updatedPlatillos[index][name] = value;
    setForm({ ...form, Platillos: updatedPlatillos });
  };

  // Para Añadir un platillo
  const handleAddPlatillo = () => {
    setForm({
      ...form,
      Platillos: [...form.Platillos, { nombre: "", cantidad: "" }],
    });
  };

  // Para crear y actualizar un platillo
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Para actualizar solo el estado
        await axios.put(`/orden/ActualizarEstado/${editingId}`, {
          Estado: form.Estado,
        });
        handleSearch();
        setEditingId(null);
      } else {
        // Crear una nueva orden
        await axios.post("/orden/crearOrden", form);
      }
      setForm({
        idMesa: "",
        Platillos: [{ nombre: "", cantidad: "" }],
        Estado: "pendiente",
      });
    } catch (err) {
      setError("Error al guardar la orden");
    }
    setLoading(false);
  };

  // Para editar la orden
  const handleEdit = (orden) => {
    setForm({
      idMesa: orden.idMesa,
      Platillos: orden.Platillos,
      Estado: orden.Estado,
    });
    setEditingId(orden._id);
  };

  // Eliminar una orden
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/orden/eliminarOrden/${id}`);
      alert("Orden eliminada");
      setOrdenes([]);
    } catch (err) {
      setError("Error al eliminar la orden");
    }
  };

  // Para la busqueda de la OrdenxIdMesa
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/orden/DetallesOrden/${searchIdMesa}`);
      setOrdenes([response.data]);
      setError("");
    } catch (err) {
      setError("Orden no encontrada");
    }
    setLoading(false);
  };

  const renderLoading = () => {
    return loading ? <div>Cargando...</div> : null;
  };

  return (
    <Navbar>
      <div className="container-xxl flex-grow-1 container-p-y">
        <h2>Gestión de Órdenes</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {renderLoading()}

        <form onSubmit={handleCreateOrUpdate}>
          <div className="mb-3">
            <label className="form-label">ID de Mesa</label>
            <input
              type="text"
              name="idMesa"
              value={form.idMesa}
              onChange={handleInputChange}
              className="form-control"
              required
              disabled={editingId !== null}
            />
          </div>
          <h2>Platillos</h2>
          {form.Platillos.map((platillo, index) => (
            <div key={index} className="mb-3">
              <h2></h2>
              <label className="form-label">Nombre del Platillo</label>
              <input
                type="text"
                name="nombre"
                value={platillo.nombre}
                onChange={(e) => handlePlatilloChange(index, e)}
                className="form-control"
                required
                disabled={editingId !== null}
              />
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={platillo.cantidad}
                onChange={(e) => handlePlatilloChange(index, e)}
                className="form-control"
                required
                disabled={editingId !== null}
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select
              name="Estado"
              value={form.Estado}
              onChange={handleInputChange}
              className="form-control"
              required
              disabled={editingId === null}
            >
              <option value="pendiente">Pendiente</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={handleAddPlatillo}
            disabled={editingId !== null}
          >
            Añadir Platillo
          </button>
          <br />
          <button type="submit" className="btn btn-primary">
            {editingId ? "Actualizar Estado" : "Crear Orden"}
          </button>
        </form>

        <hr />
        <div className="mb-3">
          <label className="form-label">Buscar Orden por ID de Mesa</label>
          <input
            type="text"
            className="form-control"
            value={searchIdMesa}
            onChange={(e) => setSearchIdMesa(e.target.value)}
            placeholder="Ingrese ID de la Mesa"
          />
          <button className="btn btn-primary mt-2" onClick={handleSearch}>
            Buscar Orden
          </button>
        </div>

        <h3 className="mt-4">Resultado de la Búsqueda:</h3>

        <table className="table">
          <thead>
            <tr>
              <th>ID Mesa</th>
              <th>Platillos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length > 0 ? (
              ordenes.map((orden) => (
                <tr key={orden._id}>
                  <td>{orden.idMesa}</td>
                  <td>
                    {orden.Platillos && orden.Platillos.length > 0 ? (
                      orden.Platillos.map((platillo, index) => (
                        <div key={index}>
                          {platillo.nombre} - {platillo.cantidad}
                        </div>
                      ))
                    ) : (
                      <div>Sin platillos</div>
                    )}
                  </td>
                  <td>{orden.Estado}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(orden)}
                    >
                      Editar Estado
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(orden._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No se encontraron órdenes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Navbar>
  );
};

export default Ordenes;
