import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editCategoria, setEditCategoria] = useState({ id: null, nombre: "" });

  // Cargar categorías
  const fetchCategorias = async () => {
    try {
      const response = await axiosInstance.get("/categoria/obtenerCategorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Crear nueva categoría
  const handleCreate = async () => {
    try {
      await axiosInstance.post("/categoria/crearCategoria", { nombre });
      setNombre("");
      fetchCategorias();
    } catch (error) {
      console.error("Error al crear la categoría", error);
    }
  };

  // Actualizar categoría
  const handleUpdate = async () => {
    try {
      await axiosInstance.put(
        `/categoria/actualizarCategoria/${editCategoria.id}`,
        { nombre: editCategoria.nombre }
      );
      setEditCategoria({ id: null, nombre: "" });
      fetchCategorias();
    } catch (error) {
      console.error("Error al actualizar la categoría", error);
    }
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/categoria/eliminarCategoria/${id}`);
      fetchCategorias();
    } catch (error) {
      console.error("Error al eliminar la categoría", error);
    }
  };

  return (
    <Navbar>
      <div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4">
          <span className="text-muted fw-light">Gestión /</span> Categorías
        </h4>

        {/* Crear nueva categoría */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control w-25 d-inline me-2"
          />
          <button onClick={handleCreate} className="btn btn-primary">
            Crear
          </button>
        </div>

        {/* Tabla de categorías */}
        <div className="card">
          <h5 className="card-header">Lista de Categorías</h5>
          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      {editCategoria.id === cat._id ? (
                        <input
                          type="text"
                          value={editCategoria.nombre}
                          onChange={(e) =>
                            setEditCategoria({
                              ...editCategoria,
                              nombre: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      ) : (
                        <span>{cat.nombre}</span>
                      )}
                    </td>
                    <td>
                      {editCategoria.id === cat._id ? (
                        <button
                          onClick={handleUpdate}
                          className="btn btn-success btn-sm me-2"
                        >
                          Guardar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setEditCategoria({
                                id: cat._id,
                                nombre: cat.nombre,
                              })
                            }
                            className="btn btn-warning btn-sm me-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-center">
                      No hay categorías disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default Categoria;
