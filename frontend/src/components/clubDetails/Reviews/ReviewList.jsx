import React, { useState, useEffect, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilSquare,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import { useFetch } from "../../hook/UseFetch.js";
import { AuthenticationContext } from "../../services/auth.context";
import { errorToast, successToast } from "../../toast/NotificationToast";

const ReviewList = ({ activityId, refreshFlag }) => {
  const { token, userId } = useContext(AuthenticationContext);
  const { getAll } = useFetch(`/reviews/activity/${activityId}`);
  const { put, del: delReview } = useFetch("/reviews");

  const [allReviews, setAllReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const reviews = await getAll(token);
      setAllReviews(reviews);
    };
    
    fetchReviews();
  }, [activityId, refreshFlag]);

  const refreshReviews = async () => {
    const updated = await getAll(token);
    setAllReviews(updated);
  };


  const handleEdit = (review) => {
    setEditingReview(review.id);
    setEditedContent(review.content);
  };

  const handleSave = async (reviewId) => {
    if (!editedContent.trim()) {
      errorToast("El contenido de la reseña no puede estar vacío.");
      return;
    }

    await put({ content: editedContent }, reviewId, token);
    setEditingReview(null);
    setEditedContent("");
    refreshReviews();
  };

  const handleDelete = async (reviewId) => {
    if (confirm("¿Estás seguro de que querés eliminar esta reseña?")) {
      await delReview(reviewId, token);
      successToast("Reseña Eliminada");
      const updatedReviews = allReviews.filter(c => c.id !== reviewId);
      setAllReviews(updatedReviews);
      // refreshReviews();
    }
  };

  return (
    <div className="review-list">
      <h5 style={{ textTransform: "uppercase", letterSpacing: "5px" }}>
        Reseñas
      </h5>
      {allReviews.length === 0 ? (
        <p>No hay reseñas aún.</p>
      ) : (
        <ul>
          {allReviews.map((review) => (
            <li key={review.id} className="review-item fade-in">
              <p>
                <strong id="username-review">{review.user?.username}</strong>
              </p>

              {editingReview === review.id ? (
                <>
                  <textarea
                    className="edit-textarea"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={() => handleSave(review.id)}>Guardar</button>
                  <button onClick={() => setEditingReview(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <div className="review-content">
                  <p>{review.content}</p>
                  {userId === review.userId && (
                    <div className="review-buttons">
                      <button
                        onClick={() => handleEdit(review)}
                        className="review-buttons edit"
                        title="Modificar comentario"
                      >
                        <FontAwesomeIcon icon={faPencilSquare} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="review-buttons delete"
                        title="Borrar"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
