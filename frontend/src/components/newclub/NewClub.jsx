import React, { useContext } from "react";
import ClubForm from "../clubForm/ClubForm";
import { useFetch } from "../hook/UseFetch.js";
import { useNavigate } from "react-router";
import { AuthenticationContext } from "../services/auth.context";

const NewClub = () => {
  const { token } = useContext(AuthenticationContext);
  const { post } = useFetch("/clubs");
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const response = await post(data, token);

    navigate(`/joined-clubs`);
  };
  return <ClubForm mode="create" onSubmit={handleSubmit} />;
};

export default NewClub;
