import React, { useState, useEffect, useContext } from "react";

import "../../styles/profile/profile.css";

import LayoutProfile from "./layoutProfile/LayoutProfile"; // layout general
import UserTable from "./AdminManagement/UsersTable"; // tabla de usuarios
import ClubsTable from "./AdminManagement/ClubsTable"; // tabla de clubes
import ProfileForm from "./profileForm/ProfileForm";
import Loading from "../error/loading/Loading";

import { useFetch } from "../hook/UseFetch.js";
import { AuthenticationContext } from "../services/auth.context";

/* Renderiza perfiles dependiendo de ROL de USUARIO */
const Profile = () => {
  const { getById, isLoading } = useFetch("/users");
  const { token, userId } = useContext(AuthenticationContext);
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const userData = await getById(userId, token);
        setUser(userData);
      }
    };
    fetchUser();
  }, [userId]);

  // isLoading
  if (isLoading) return <Loading />;

  const handleEditProfile = () => setShow((prev) => !prev);

  const ProfileEditSection = () => (
    <div className="form">
      <button className="link-button" onClick={handleEditProfile}>
        {show ? "Cerrar Edición" : "Editar Perfil"}
      </button>

      {show && (
         <ProfileForm
          user={user}
          setUser={setUser}
          show={show}
          setShow={setShow}
          className={show ? "profile-edit" : ""}
        />
      )}
    </div>
  );

  const renderRoleTools = () => {
    if (user.role === "superadmin") {
      return (
        <>
          <h3 className="superadmin-title">Gestión de Usuarios (SuperAdmin)</h3>
          <UserTable />

          <h3 className="superadmin-title">Gestión de Clubes (SuperAdmin)</h3>
          <ClubsTable />
        </>
      );
    }
    if (user.role === "admin") {
      return (
        <>
          <h3 className="superadmin-title">Gestión de Clubes (Admin)</h3>
          <ClubsTable />
        </>
      );
    }
    return null;
  };

  return (
      <LayoutProfile user={user}>
        <div className="tools">
          <ProfileEditSection />
          {renderRoleTools()}
        </div>
      </LayoutProfile>
  );
};

export default Profile;
