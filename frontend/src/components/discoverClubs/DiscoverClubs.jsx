import React, { useState, useEffect, useContext } from "react";

import LeftNav from "../nav/LeftNav";
import ClubList from "../clubList/ClubList";

import Loading from "../error/loading/Loading";
import { useFetch } from "../hook/UseFetch.js";

import { AuthenticationContext } from "../services/auth.context";

const DiscoverClubs = () => {
  const { getAll, isLoading } = useFetch("/clubs");
  const { token, userId } = useContext(AuthenticationContext);
  const { getById } = useFetch('/clubs/user');
  const [allClubs, setAllClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clubs = await getAll();
      const userClubs = await getById(userId, token);

      if (clubs) setAllClubs(clubs);
      if (userClubs) setJoinedClubs(userClubs);
    };

    fetchData();
  }, [userId]);


  const joinedIds = joinedClubs.map(c => c.id);

  // Filtra: clubes que son inactivos, no aparecen en "mis clubes" y clubes que
  // usuario está participado
  const filteredActiveClubs = allClubs.filter(c => c.isActive && !joinedIds.includes(c.id));

  if (isLoading) return <Loading />

  return (
    <>
      <LeftNav />
      <div className="space"></div>
      <div className="space"></div>

      <div className="hero-container">
        <div className="hero-club">
          <ClubList clubs={filteredActiveClubs} title="Descubre" showButtons={false} />

          <div className="break"></div>
        </div>
      </div>
    </>
  );
};

export default DiscoverClubs;
