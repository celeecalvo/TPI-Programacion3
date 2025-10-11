import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router";
import ReviewForm from "../Reviews/ReviewForm";
import PastActivity from "./PastActivity";
import { useFetch } from "../../hook/UseFetch.js";
import { AuthenticationContext } from "../../services/auth.context";
import { errorToast, successToast } from "../../toast/NotificationToast";

import {
  showConfirmAlert,
  showConfirmFinish,
  showSweetNewActivity,
} from "../../sweetAlert/ConfirmAlert";

const Activities = ({ clubId, joined }) => {
  const { token, role } = useContext(AuthenticationContext);
  const { getAll } = useFetch(`/clubs/${clubId}/activities`);
  const { del, put } = useFetch(`/activities`);
  const { getById } = useFetch("/books");
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [currentBook, setCurrentBook] = useState("");
  const [currentActivity, setCurrentActivity] = useState("");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activitiesList = await getAll(token);
        setActivities(activitiesList);

        const active = activitiesList.find((act) => act.isActive);
        setCurrentActivity(active);

        if (active?.bookId) {
          const book = await getById(active.bookId, token);
          setCurrentBook(book);
        }
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };

    fetchActivity();
  }, [clubId, token]);

  const pastActivities = activities
    .filter((a) => !a.isActive)
    .sort((a, b) => new Date(b.dateEnd) - new Date(a.dateEnd));

  if (activities.length === 0) {
    return (
      <>
        {role.includes("admin") && (
          <div className="edit-club-btn">
            <Link to={`/new-activity/${clubId}`} className="create-button">
              <FontAwesomeIcon icon={faPlus} /> Nueva Actividad
            </Link>
          </div>
        )}
        <p className="no-activities">
          No hay actividades en este club todavía.
        </p>
      </>
    );
  }

  const handleFinish = async (activityId) => {
    try {
      await put({ isActive: false }, activityId, token);
      successToast("Actividad marcada como finalizada.");

      setActivities((prev) =>
        prev.map((act) =>
          act.id === activityId ? { ...act, isActive: false } : act
        )
      );
      setCurrentActivity(null);
      setCurrentBook(null);
    } catch (error) {
      console.error("Error al finalizar actividad:", error);
      errorToast("No se pudo finalizar la actividad.");
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await del(activityId, token);
      setActivities((prev) => prev.filter((act) => act.id !== activityId));

      if (currentActivity?.id === activityId) {
        setCurrentActivity(null);
        setCurrentBook(null);
      }

      successToast("Actividad borrada correctamente.");
    } catch (error) {
      console.error("Error al borrar la actividad:", error);
      errorToast("No se pudo borrar la actividad. Intenta más tarde.");
    }
  };

  const formatDate = (dateStr) => {
    return dateStr.split("-").reverse().join("/");
  };

  return (
    <div className="club-activities">
      {role.includes("admin") && currentActivity && (
        <div
          className="edit-club-btn"
          style={{ display: "flex", gap: "1rem", margin: "auto" }}
        >
          <Link
            to={`/edit-activity/${currentActivity.id}`}
            className="edit-button"
          >
            <FontAwesomeIcon icon={faPenToSquare} /> Editar Actividad
          </Link>

          <button
            onClick={() =>
              showSweetNewActivity(
                currentActivity.id,
                handleFinish,
                navigate,
                clubId
              )
            }
            className="create-button"
          >
            <FontAwesomeIcon icon={faPlus} /> Nueva Actividad
          </button>

          <button
            className="end-button"
            onClick={() => showConfirmFinish(currentActivity.id, handleFinish)}
          >
            <FontAwesomeIcon icon={faCheckCircle} /> Finalizar Actividad
          </button>

          <button
            className="delete-button"
            onClick={() => showConfirmAlert(currentActivity.id, handleDelete)}
          >
            <FontAwesomeIcon icon={faTrash} /> Borrar Actividad
          </button>
        </div>
      )}

      {/* Actividad Actual */}
      {currentActivity ? (
        <section className="current-activity">
          <h3 className="activity-title text-align">Lectura en curso</h3>
          <div className="activity-card current">
            <div className="activity-dates">
              <p className="dates">
                <strong>📅 Del:</strong> {formatDate(currentActivity.dateStart)}{" "}
                <br />
                {!currentActivity.dateEnd.includes("Inv") && (
                  <>
                    <strong>🗓️ al:</strong>{" "}
                    {formatDate(currentActivity.dateEnd)}
                  </>
                )}
              </p>
            </div>

            {currentBook && (
              <div className="book-details-container">
                <div className="book-details highlighted-book">
                  {currentBook.image && (
                    <img
                      src={`/${currentBook.image}`}
                      alt={`Portada de ${currentBook.title}`}
                      className="book-cover"
                    />
                  )}

                  <div className="book-text">
                    <h3 className="book-section-title">📚 Lectura Actual</h3>
                    <h2 className="book-title">{currentBook.title}</h2>
                    <p className="book-author">
                      <em>{currentBook.author}</em>
                    </p>
                    <p>{currentBook.summary}</p>
                  </div>
                </div>
              </div>
            )}

            {joined ? (
              <div className="reviews-section">
                <ReviewForm activityId={currentActivity.id} />
              </div>
            ) : (
              <p className="error">
                Debes unirte al Club para participar de la Actividad.
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          {role.includes("admin") && (
            <div className="edit-club-btn">
              <Link to={`/new-activity/${clubId}`} className="create-button">
                <FontAwesomeIcon icon={faPlus} /> Nueva Actividad
              </Link>
            </div>
          )}
          <p className="no-active">
            Actualmente no hay ninguna lectura activa.
          </p>
        </>
      )}

      {/* Actividades pasadas */}
      {pastActivities.length > 0 && (
        <div className="past-activities">
          <h3 className="section-title">📚 Actividades Finalizadas</h3>
          {pastActivities.map((pastAct) => (
            <PastActivity key={pastAct.id} activity={pastAct} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
