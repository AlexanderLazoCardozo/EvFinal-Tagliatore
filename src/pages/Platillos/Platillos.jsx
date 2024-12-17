import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "../../api/axios";

const Platillos = () => {
    const [platillos, setPlatillos] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        ingredientes: "",
        precio: "",
        imagenes: "",
        disponible: true
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [searchId, setSearchId] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "ingredientes") {
            setForm({ ...form, [name]: value.split(',').map(ing => ing.trim()) });
        } else if (name === "precio") {
            setForm({ ...form, [name]: parseFloat(value) });
        } else if (name === "disponible") {
            setForm({ ...form, [name]: value === "true" });
        } else {
            setForm({ ...form, [name]: value });
        }
    };
    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const arrayImagenes = form.imagenes ? form.imagenes.split(',').map(img => img.trim()) : [];
            const formToSend = { ...form, imagenes: arrayImagenes };

            if (editingId) {
                const response = await axios.put(`/platillo/actualizarPlatillo/${editingId}`, formToSend);
                if (response.data.success) {
                    setEditingId(null);
                    handleSearch();
                    alert(response.data.message);
                }
            } else {
                const response = await axios.post("/platillo/crearPlatillo", formToSend);
                if (response.data.success) {
                    alert(response.data.message);
                }
            }

            setForm({
                nombre: "",
                ingredientes: "",
                precio: "",
                imagenes: "",
                disponible: true
            });
            setError("");
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                "Error al guardar el platillo";
            setError(errorMessage);
            console.error(err);
        }
    };

    const handleEdit = (platillo) => {
        const platilloToEdit = {
            ...platillo,
            ingredientes: platillo.ingredientes.join(', '),
            imagenes: platillo.imagenes ? platillo.imagenes.join(', ') : ''
        };
        setForm(platilloToEdit);
        setEditingId(platillo._id);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/platillo/eliminarPlatillo/${id}`);
            if (response.data.success) {
                alert(response.data.message);
                setPlatillos([]);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                "Error al eliminar el platillo";
            setError(errorMessage);
            console.error(err);
        }
    };

    const handleSearch = async () => {
        try {
            if (!searchId) {
                const response = await axios.get("/platillo/obtenerTodosPlatillos");
                if (response.data.platillos) {
                    setPlatillos(response.data.platillos);
                    setError("");
                }
                return;
            }

            const response = await axios.get(`/platillo/obtenerPlatillo/${searchId}`);
            if (response.data.success) {
                setPlatillos([response.data.platillo]);
                setError("");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                "Platillo no encontrado";
            setError(errorMessage);
            setPlatillos([]);
            console.error(err);
        }
    };

    return (
        <Navbar>
            <div className="container-xxl flex-grow-1 container-p-y">
                <h2>Gestión de Platillos</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                {/* Formulario para crear o actualizar platillo */}
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
                        <label className="form-label">Ingredientes (separados por coma)</label>
                        <input
                            type="text"
                            name="ingredientes"
                            value={form.ingredientes}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input
                            type="number"
                            name="precio"
                            value={form.precio}
                            onChange={handleInputChange}
                            className="form-control"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Imágenes (URLs separadas por coma)</label>
                        <input
                            type="text"
                            name="imagenes"
                            value={form.imagenes}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="https://ejemplo1.com/imagen1.jpg, https://ejemplo2.com/imagen2.jpg"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Disponibilidad</label>
                        <select
                            name="disponible"
                            value={form.disponible}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value={true}>Disponible</option>
                            <option value={false}>No Disponible</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? "Actualizar Platillo" : "Crear Platillo"}
                    </button>
                </form>
                <hr />
                <div className="mb-3">
                    <label className="form-label">Buscar Platillo por ID (dejar vacío para ver todos)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Ingrese ID del platillo (opcional)"
                    />
                    <button className="btn btn-primary mt-2" onClick={handleSearch}>
                        Buscar Platillo
                    </button>
                </div>

                <h3 className="mt-4">Resultado de la Búsqueda de Platillos:</h3>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Imágenes</th>
                            <th>Nombre</th>
                            <th>Ingredientes</th>
                            <th>Precio</th>
                            <th>Disponibilidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {platillos.map((platillo) => (
                            <tr key={platillo._id}>
                                <td>
                                    <div className="d-flex flex-wrap">
                                        {platillo.imagenes && platillo.imagenes.length > 0 ? (
                                            platillo.imagenes.map((imagen, index) => (
                                                <div
                                                    key={index}
                                                    className="m-1"
                                                    style={{
                                                        width: '150px',
                                                        height: '150px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <img
                                                        src={imagen}
                                                        alt={`${platillo.nombre} - Imagen ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            'Sin imágenes'
                                        )}
                                    </div>
                                </td>
                                <td>{platillo.nombre}</td>
                                <td>{platillo.ingredientes.join(', ')}</td>
                                <td>S/{platillo.precio.toFixed(2)}</td>
                                <td>{platillo.disponible ? 'Disponible' : 'No Disponible'}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleEdit(platillo)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm ms-2"
                                        onClick={() => handleDelete(platillo._id)}
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

export default Platillos;