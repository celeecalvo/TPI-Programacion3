import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router'

import Search from "../../search/Search";
import { useFetch } from "../../hook/UseFetch.js";
import { AuthenticationContext } from "../../services/auth.context";
import { successToast, errorToast } from "../../toast/NotificationToast";
import { showConfirmAlert } from "../../sweetAlert/ConfirmAlert";

import "sweetalert2/dist/sweetalert2.min.css";

const ClubsTable = () => {
  const { getAll, put, del } = useFetch("/clubs");
  const { getAll: getAllActivities } = useFetch("/activities");
  const { token } = useContext(AuthenticationContext);

  const [allActivities, setAllActivities] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [editingClubId, setEditingClubId] = useState(null);
  const [editedClub, setEditedClub] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsData = await getAll(token);
        const activitiesData = await getAllActivities(token);

        setAllActivities(activitiesData);

        // array de clubs con actividades en hasActivity
        const clubsWithActivity = clubsData.map((club) => ({
          ...club,
          hasActivity: activitiesData.some(
            (activity) => activity.clubId === club.id
          ),
        }));

        setAllClubs(clubsWithActivity);
      } catch (error) {
        console.error("Error al cargar clubes:", error);
        errorToast("Error al cargar clubes");
      }
    };

    fetchClubs();
  }, [token, getAll, getAllActivities]);

  const filteredClubs = allClubs.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClub = (club) => {
    setEditingClubId(club.id);
    setEditedClub({ ...club });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditedClub({ ...editedClub, [name]: newValue });
  };

  const handleSaveClub = async (id) => {
    try {
      await put(editedClub, id, token);

      const updatedClubs = allClubs.map((club) =>
        club.id === id ? { ...editedClub } : club
      );

      setAllClubs(updatedClubs);
      setEditingClubId(null);
      setEditedClub({});
      successToast("Club actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar club:", error);
      errorToast("Error al actualizar club");
    }
  };

  const handleDeleteClub = (id) => {
    showConfirmAlert(id, async (idToDelete) => {
      try {
        const deleted = await del(idToDelete, token);
        if (deleted) {
          const updatedClubs = allClubs.filter((c) => c.id !== idToDelete);
          setAllClubs(updatedClubs);
          successToast("Club eliminado correctamente");
        }
      } catch (error) {
        console.error("Error eliminando club:", error);
        errorToast("Error eliminando club");
      }
    });
  };

  return (
    <>
      <Search onSearch={setSearchTerm} placeholder="Buscar Club..." />
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Interés</th>
              <th>Género</th>
              <th>Actividad</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <tr key={club.id}>
                  <td>
                    {editingClubId === club.id ? (
                      <input
                        name="name"
                        value={editedClub.name}
                        onChange={handleChange}
                        className="select-gender"
                      />
                    ) : (
                      club.name
                    )}
                  </td>
                  <td>
                    {editingClubId === club.id ? (
                      <input
                        className="select-gender"
                        name="interest"
                        value={editedClub.interest}
                        onChange={handleChange}
                      />
                    ) : (
                      club.interest
                    )}
                  </td>
                  <td>
                    {editingClubId === club.id ? (
                      <input
                        className="select-gender"
                        name="gender"
                        value={editedClub.gender}
                        onChange={handleChange}
                      />
                    ) : (
                      club.gender
                    )}
                  </td>
                  <td>
                    {club.hasActivity ? (
                      <span className="status-active">Tiene Actividad</span>
                    ) : (
                      <span className="status-inactive">Sin Actividad</span>
                    )}
                  </td>
                  <td>
                    {editingClubId === club.id ? (
                      <select
                        className="select-gender"
                        name="isActive"
                        value={editedClub.isActive ? "true" : "false"}
                        onChange={(e) =>
                          setEditedClub({
                            ...editedClub,
                            isActive: e.target.value === "true",
                          })
                        }
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    ) : (
                      <span
                        className={
                          club.isActive ? "status-active" : "status-inactive"
                        }
                      >
                        {club.isActive ? "Activo" : "Inactivo"}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingClubId === club.id ? (
                      <button
                        className="btn-save"
                        id="btn-save"
                        onClick={() => handleSaveClub(club.id)}
                        title="Guardar cambios"
                      >
                        {<FontAwesomeIcon icon={faFloppyDisk} />}
                      </button>
                    ) : (
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClub(club)}
                        title="Editar club"
                      >
                        Editar
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClub(club.id)}
                      title="Eliminar Club"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No se encontraron clubes
                </td>
              </tr>
            )}
            <tr className="new-club-row">
              <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                <a href="/new-club" className="btn-card add">
                  + Crear nuevo club
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ClubsTable;
