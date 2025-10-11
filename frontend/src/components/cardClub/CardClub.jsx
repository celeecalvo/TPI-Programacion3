import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import "./cardClub.css";
import { showConfirmAlert } from "../sweetAlert/ConfirmAlert";
import "sweetalert2/dist/sweetalert2.min.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from "../hook/UseFetch.js";

import { AuthenticationContext } from "../services/auth.context";


/* Acá están los cards de cada club */
const CardClub = ({ club, showButtons, setAllClubs, allClubs }) => {
  const { token, role } = useContext(AuthenticationContext);
  const { del } = useFetch("/clubs");
  const navigate = useNavigate();

  const handleClickEdit = (id) => {
    navigate(`/modify-club/${id}`);
  };

  const handleClickActivity = (id) => {
    navigate(`/new-activity/${id}`);
  };

  const handleDelete = async (id) => {
    const deleteClub = await del(id, token);

    if(deleteClub) {
      const updatedClubs = allClubs.filter((c) => c.id !== id);
      setAllClubs(updatedClubs);
    }
  };

  return (
    <div
      className={`club-card-child ${club.color}`}
    >
      <FontAwesomeIcon icon={faBook} size="3x" />
      <p>{club.name}</p>
      {showButtons && (
        <div className="btn-cards">
          <button
            type="submit"
            className="btn-card"
            onClick={() => handleClickEdit(club.id)}
            title="Modificar Club"
          >
            Modificar
          </button>
          <button
            type="submit"
            className="btn-card"
            onClick={() => showConfirmAlert(club.id, handleDelete)}
            title="Eliminar Club"
          >
            Eliminar
          </button>
          <button
            type="submit"
            className="btn-card"
            onClick={() => handleClickActivity(club.id)}
            title="Agregar Nueva Actividad"
          >
            <FontAwesomeIcon icon={faPlus} id="btn-plus" />
          </button>
        </div>
      )}
      <Link to={`/club-details/${club.id}`} className="link-button">Ver detalles</Link>
    </div>
  );
};

export default CardClub;
