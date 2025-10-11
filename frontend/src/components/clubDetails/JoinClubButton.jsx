import React, { useContext, useState, useEffect } from "react";
import { AuthenticationContext } from "../services/auth.context";
import { useNavigate } from "react-router";
import { useFetch } from "../hook/UseFetch.js";
import { successToast, errorToast, infoToast } from "../toast/NotificationToast";

const JoinClubButton = ({ clubId, onJoinChange }) => {
  const { token, userId } = useContext(AuthenticationContext);
  const { postWithoutData, delWithoutId } = useFetch(
    `/users/${userId}/clubs/${clubId}`
  );
  const { getById } = useFetch(`/clubs/user`);
  const [joined, setJoined] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMember = async () => {
      const member = await getById(userId, token);
      const isJoined = member.some((club) => club.id === Number(clubId));
      setJoined(isJoined);
    };

    fetchUserMember();
  }, [userId, clubId]);

  const handleClickJoin = async () => {
    try {
      const response = await postWithoutData(token);

      if (
        response?.error ||
        response?.message?.toLowerCase()?.includes("error")
      ) {
        errorToast(response.message || "No se pudo unir al club.");
      } else {
        successToast("¡Te uniste a este club correctamente!");
        setJoined(true);
        onJoinChange?.(true);
        localStorage.setItem(`joined_${userId}_${clubId}`, "true");
      }
    } catch (error) {
      console.error("Error al unirse al club:", error);
      errorToast("Hubo un problema al unirse al club.");
    }
  };

  const handleDeleteJoin = async () => {
    try {
      const response = await delWithoutId();

      if (
        response?.error ||
        response?.message?.toLowerCase()?.includes("error")
      ) {
        errorToast(response.message || "No se pudo salir del club.");
      } else {
        infoToast(
          response.message ||
            "¡Te vamos a extrañar! Te eliminaste de este club correctamente"
        );
        setJoined(false);
        onJoinChange?.(false);
        localStorage.removeItem(`joined_${userId}_${clubId}`);
        setTimeout(() => navigate("/joined-clubs"), 1000);
      }
    } catch (error) {
      console.error("Error al eliminarse del club:", error);
      errorToast("Hubo un problema al eliminarse del club.");
    }
  };

  return (
    <button
      type="submit"
      className={joined ? "btn-card btn-leave" : "btn-card"}
      onClick={joined ? handleDeleteJoin : handleClickJoin}
    >
      {joined ? "Salir del club" : "¡Unirse!"}
    </button>
  );
};

export default JoinClubButton;
