import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import LeftNav from "../nav/LeftNav";
import FooterSmall from "../footer/FooterSmall";
import ClubList from "../clubList/ClubList";
import Search from "../search/Search";
import Loading from "../error/loading/Loading";
import nadaAquiImage from "../../assets/img/error-img/nada-aqui.webp";
import { useFetch } from "../hook/UseFetch.js";

import { AuthenticationContext } from "../services/auth.context";

/* Exporta clubs Admin */
const JoinedClubsAdmin = () => {
  const { getAll, isLoading } = useFetch("/clubs");
  const { token, userId } = useContext(AuthenticationContext);
  const { getById } = useFetch("/users");
  const [allClubs, setAllClubs] = useState([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const handleClickCreate = () => {
    navigate("/new-club");
  };

  useEffect(() => {
    window.scrollTo(0, 0); // vuelve al top de la pagina

    const fetchData = async () => {
      const clubs = await getAll();

      if (clubs) {
        setAllClubs(clubs);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const userData = await getById(userId, token);
        setUser(userData);
      }
    };

    fetchUser();
  }, [userId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <LeftNav />
      <div className="space"></div>
      <div className="space"></div>

      <div className="hero-container">
        <div className="hero-club">
          {allClubs.length > 0 ? (
            <ClubList
              clubs={allClubs}
              title="Administrador de Clubs"
              showButtons={user.role.includes("admin")}
              setAllClubs={setAllClubs}
              allClubs={allClubs}
            />
          ) : (
            <div className="nada-aqui-container">
              <h2 className="text-align">No hay nada aquí...</h2>
              <img
                src={nadaAquiImage}
                alt="imagen de un gatito corriendo una lana"
                className="img-nada-aqui"
              />
            </div>
          )}

          <button className="cssbuttons-io-button" onClick={handleClickCreate}>
            <FontAwesomeIcon icon={faPlus} id="btn-plus" />
            <span>Club</span>
          </button>

          <div className="space"></div>
        </div>
      </div>
    </>
  );
};

export default JoinedClubsAdmin;
