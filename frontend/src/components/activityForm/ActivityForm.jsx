import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import LeftNav from "../nav/LeftNav";
import FooterSmall from "../footer/FooterSmall";
import logo from "../../assets/img/logo/Logo-InkLink.webp";
import { errorToast, successToast } from "../toast/NotificationToast";

import { useFetch } from "../hook/UseFetch.js";

const ActivityForm = ({ mode = "create", initialData = {}, onSubmit }) => {
  const { getAll } = useFetch("/books");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAll();
        setBooks(response);
      } catch (error) {
        errorToast("Error al cargar libros.");
      }
    };

    fetchBooks();
  }, []);

  const [nameBook, setNameBook] = useState("");
  const [progress, setProgress] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [errors, setErrors] = useState("");

  const handleDateStartChange = (e) => {
    setDateStart(e.target.value);
  };

  const handleDateEndChange = (e) => {
    setDateEnd(e.target.value);
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setNameBook(initialData.nameBook || "");
      setProgress(initialData.progress || "");
      setDateStart(initialData.dateStart || "");
      setDateEnd(initialData.dateEnd || "");
    }
  }, [initialData, mode]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!nameBook) {
      newErrors.nameBook = "Seleccione un libro para la actividad";
      errorToast("Seleccione un libro para la actividad");
      valid = false;
    }

    if (!progress) {
      newErrors.progress = "Seleccione una opción de progreso.";
      errorToast("Seleccione una opción de progreso.");
      valid = false;
    }

    if (!dateStart) {
      newErrors.dateStart = "Debe colocar una fecha de inicio.";
      errorToast("Debe colocar una fecha de inicio.");
      valid = false;
    }

    if (dateEnd && new Date(dateEnd) < new Date(dateStart)) {
      newErrors.dateEnd = "La fecha de fin no puede ser anterior a la fecha de inicio.";
      errorToast("La fecha de fin no puede ser anterior a la fecha de inicio.");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const activityData = {
        bookId: nameBook,
        progress,
        dateStart,
        dateEnd,
        isActive: true,
      };
  
      onSubmit(activityData);
      if (mode === "create") {
        successToast("Actividad creada correctamente.");
      } else if (mode === "edit") {
        successToast("Actividad actualizada correctamente.");
      }
    } catch (error) {
      errorToast('Error interno del servidor.');
      return;
    }

  };

  return (
    <div>
      <LeftNav />

      <div className="space"></div>

      <div className="form-container">
        <div className="logo-form">
          <img src={logo} alt="Logo Inklink" />
        </div>

        <h2 className="text-align title-form">
          {mode === "edit"
            ? "ACTUALIZAR ACTIVIDAD"
            : "CREAR UNA NUEVA ACTIVIDAD"}
        </h2>
        <br />
        <form onSubmit={handleSubmit}>
          <label>Seleccione un libro:</label>
          <select
            className="select-gender"
            name="nameBook"
            value={nameBook}
            onChange={(e) => setNameBook(e.target.value)}
          >
            <option value="">Seleccione un libro</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          {errors.nameBook && <p className="error">{errors.nameBook}</p>}

          <label>Ingrese el Sistema de Progreso:</label>
          <select
            name="progress"
            id="progress"
            className="select-gender"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            <option value="sincronica">Forma Sincrónica</option>
            <option value="asincronica">Forma Asincrónica</option>
          </select>
          {errors.progress && <p className="error">{errors.progress}</p>}

          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={dateStart}
            onChange={handleDateStartChange}
          />
          {errors.dateStart && <p className="error">{errors.dateStart}</p>}

          <label name="fechaFin">Fecha Fin:</label>
          <input type="date" value={dateEnd} onChange={handleDateEndChange} />
          {errors.dateEnd && <p className="error">{errors.dateEnd}</p>}

          <button type="submit">
            {mode === "edit" ? "Actualizar Actividad" : "Crear Actividad"}
          </button>
          <Link to="/joined-clubs" className="link-button secondary text-align">
            Cancelar
          </Link>
        </form>
      </div>

      <div className="space"></div>
      <div className="space"></div>

    </div>
  );
};

export default ActivityForm;
