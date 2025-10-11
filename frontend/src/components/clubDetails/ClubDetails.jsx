import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import LeftNav from "../nav/LeftNav";
import logo from "../../assets/img/logo/Logo-InkLink.webp";
import NotFound from "../error/notFound/NotFound";
import { useFetch } from "../hook/UseFetch.js";
import Activities from "./activities/Activities";
import Loading from "../error/loading/Loading";
import JoinClubButton from "./JoinClubButton";

import { AuthenticationContext } from "../services/auth.context";

import "./clubDetails.css";

const ClubDetails = () => {
  const { getById, isLoading } = useFetch("/clubs");
  const { userId } = useContext(AuthenticationContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    //trae los detalles del club
    const fetchClub = async () => {
      const clubData = await getById(id);
      setClub(clubData);

      const isJoined = localStorage.getItem(`joined_${userId}_${id}`) === "true";
      setJoined(isJoined);
    };
    fetchClub();
  }, [id, userId]);

  const handleJoinChange = (value) => {
    setJoined(value);
  };

  if (isLoading) return <Loading />;

  if (!club) return <NotFound />;

  const { name, description, gender, interest } = club;

  // Agg botón para unirse al Club
  return (
    <div>
      <LeftNav />
      <main className="club-details-container">
        <section className="club-header">
          <div className="logo-wrapper">
            <img src={logo} alt="Logo Inklink" />
          </div>
          <h2 className="club-title">{name}</h2>
        </section>
        <section className="club-info">
          <h2 id="detalleClub" className="text-align">
            {name}
          </h2>
          <br />
          <div className="details-container">
            <p>
              <strong>Género:</strong> {gender}
            </p>
            <br />
            <p>
              <strong>Interés:</strong> {interest}
            </p>
            <br />
            <p>
              <strong>Descripción:</strong> {description}
            </p>
            <br />
          </div>

          <div className="button-separate">
            <JoinClubButton clubId={id} onJoinChange={handleJoinChange} />
            <button
              className="btn-back"
              onClick={() => navigate("/joined-clubs")}
            >
              Volver a Clubs
            </button>
          </div>
        </section>
        <section className="club-activities">
          <Activities clubId={id} joined={joined} />
        </section>
      </main>
    </div>
  );
};

export default ClubDetails;
