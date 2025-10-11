import React, { useContext } from "react";

import { useNavigate, useParams } from "react-router";
import { useFetch } from "../hook/UseFetch.js";
import ActivityForm from "../activityForm/ActivityForm";
import { errorToast } from "../toast/NotificationToast";

import { AuthenticationContext } from "../services/auth.context";

const NewActivity = () => {
  const { id } = useParams();
  const { token } = useContext(AuthenticationContext);
  const { post } = useFetch(`/clubs/${id}/activities`);

  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const response = await post(data, token);

      navigate(`/club-details/${id}`);
    } catch (error) {
      errorToast(
        "Error al crear la actividad. Puede que ya exista una actividad vigente."
      );
    }
  };
  return <ActivityForm mode="create" onSubmit={handleSubmit} />;
};

export default NewActivity;
