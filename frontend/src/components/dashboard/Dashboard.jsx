import React, { useState, useEffect } from "react";
import LeftNav from "../nav/LeftNav";
import { Routes, Route } from "react-router";
import Clubes from "../clubes/Clubes";
import GoToTop from "../goToTop/GoToTop";
import MisClubes from "../joinedClubs/JoinedClubs";
import Search from "../search/Search";
import Profile from "../profile/Profile";
import FooterSmall from "../footer/FooterSmall";

import { useFetch } from "../hook/UseFetch.js";
import Loading from "../error/loading/Loading";
import DiscoverClubs from "../discoverClubs/DiscoverClubs";

const Dashboard = () => {
  const { getAll, isLoading } = useFetch("/clubs");
  const [allClubs, setAllClubs] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      const clubs = await getAll();

      if (clubs) {
        setAllClubs(clubs);
      }
    };

    fetchData();
  }, [])


  // Los clubes que son inactivos, no aparecen en "mis clubes"
  const filteredActiveClubs = allClubs.filter(c => {
    if (c.isActive) {
      return c;
    }
  })

  if (isLoading) return <Loading />

  return (
    <div>
      <LeftNav />

      <Routes>
        <Route index element={<Clubes clubs={filteredActiveClubs} />} />{" "}
        {/* /* PRINCIPAL - donde estan los clubes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/joined-clubs" element={<MisClubes clubs={allClubs} setAllClubs={setAllClubs} />} />
        <Route path="/discover-clubs" element={<DiscoverClubs />} />
      </Routes>

      <GoToTop />
      <div className="space"></div>
      <div className="space"></div>
    </div>
  );
};

export default Dashboard;
