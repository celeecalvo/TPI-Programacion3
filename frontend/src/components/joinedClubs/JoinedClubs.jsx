import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";

import LeftNav from "../nav/LeftNav";
import FooterSmall from "../footer/FooterSmall";
import ClubList from "../clubList/ClubList";
import Search from "../search/Search";
import Loading from "../error/loading/Loading";
import nadaAquiImage from "../../assets/img/error-img/nada-aqui.webp";
import { useFetch } from "../hook/UseFetch.js";
import JoinedClubsAdmin from "./JoinedClubsAdmin";

import { AuthenticationContext } from "../services/auth.context";

const JoinedClubs = () => {
  const { userId, token } = useContext(AuthenticationContext);
  const { getAll, isLoading } = useFetch(`/clubs/user/${userId}`);
  const [usersClubs, setUsersClubs] = useState([]);
  const { getById } = useFetch("/users");
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const userData = await getById(userId, token);
        setUser(userData);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    window.scrollTo(0, 0); // vuelve al top de la pagina

    const fetchData = async () => {
      if (!userId) return;

      const uClubs = await getAll();
      if (uClubs) {
        setUsersClubs(uClubs);
      }
    };
    fetchData();
  }, [userId]);

  if (isLoading) return <Loading />;

  return (
    <>
      {user.role.includes("admin") ? (
        <JoinedClubsAdmin />
      ) : (
        <>
          <LeftNav />
          <div className="space"></div>

          <div className="hero-container">
            <div className="hero-club">
              <Link to="/join-us" className="link-subrayado dark crear-club">
                ¿Querés crear tus propios clubes?
              </Link>
              
              {usersClubs.length > 0 ? (
                <ClubList
                  clubs={usersClubs}
                  title="Mis Clubes"
                  showButtons={user.role.includes("admin")}
                  setAllClubs={usersClubs}
                  allClubs={usersClubs}
                />
              ) : (
                <div className="nada-aqui-container">
                  <h2 className="text-align">No hay nada aquí...</h2>
                  <img
                    src={nadaAquiImage}
                    alt="imagen de un gatito corriendo una lana"
                    className="img-nada-aqui"
                  />
                  <Link to="/discover-clubs" className="link-subrayado dark">
                    ¡Descubre nuevas comunidades!
                  </Link>
                </div>
              )}

              <div className="space"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JoinedClubs;
