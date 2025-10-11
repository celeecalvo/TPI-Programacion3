import React, { useState, useEffect, useContext } from "react";
import { successToast, errorToast } from "../../toast/NotificationToast";
import { validateString, validateEmail } from "../../auth/Auth.services";

import logo from "../../../assets/img/logo/Logo-InkLink.webp";

import { useFetch } from "../../hook/UseFetch.js";
import { AuthenticationContext } from "../../services/auth.context";

const ProfileForm = ({ user, setUser, show, setShow }) => {
  const { put } = useFetch("/profile");
  const { token, userId } = useContext(AuthenticationContext);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    backend: "",
  });


  const avatarList = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
    "/avatars/avatar5.png",
    "/avatars/avatar6.png",
  ];

  // cada vez que cambie show, hace scroll o no
  useEffect(() => {
    window.scrollTo({ top: show ? 300 : 0, behavior: "smooth"});
  }, [show]);

  // llena estados cuando cambie user
  useEffect(() => {
    if (user) {
      setUserName(user.username || "");
      setEmail(user.email || "");
      setBirthdate(user.birthday || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    if (!validateString(userName, 3, 20)) {
      newErrors.userName =
        "El nombre de usuario debe tener entre 3 y 20 caracteres.";
      formIsValid = false;
    }

    if (!validateEmail(email)) {
      newErrors.email = "El email no es válido.";
      formIsValid = false;
    }

    /* if (!birthdate) {
      newErrors.birthdate = "La fecha de nacimiento es requerida.";
      formIsValid = false;
    } */

    if (!avatar) {
      newErrors.avatar = "Debes seleccionar un avatar.";
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorToast("Por favor corrige los errores en el formulario.");
      return;
    }

    // Si no hubo cambios, se cierra el formulario
    if (
      userName === user.username &&
      email === user.email &&
      avatar === user.avatar
    ) {
      setShow(false);
      return;
    }

    const updatedUser = {
      username: userName,
      email,
      avatar,
    };

    try {
      const response = await put(updatedUser, userId, token);

      if (response.message.includes("ya está")) {
        setErrors((prev) => ({ ...prev, backend: response.message }));
        errorToast(response.message);
        return;
      }

      successToast("Perfil actualizado correctamente.");

      // actualizamos los datos en pantalla
      setUser((prevUser) => ({
        ...prevUser,
        username: userName,
        email,
        avatar
      }));

      setTimeout(() => setShow(false), 1500);
    } catch (err) {
      errorToast("Error al actualizar el perfil.");
    }
  };

  return (
    <div
      className={
        show ? "profile-container-user show" : "profile-container-user"
      }
    >
      <div className="form-container margin">
        <div className="logo-form">
          <img src={logo} alt="Logo Inklink" />
        </div>
        <div className="form">
          <h3 className="title-form">Actualizar perfil</h3>
          <form onSubmit={handleSubmit} className="profile-form">
            <label>Editar nombre de Usuario:</label>
            <input
              type="text"
              value={userName}
              placeholder={user.username}
              onChange={(e) => setUserName(e.target.value)}
            />
            {errors.userName && <p className="error">{errors.userName}</p>}

            <label>Editar Email:</label>
            <input
              type="email"
              value={email}
              placeholder={user.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            {/* <label>Fecha de nacimiento</label>
            <input
              type="date"
              placeholder={user.birthday}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
            {errors.birthdate && <p className="error">{errors.birthdate}</p>} */}

            <label>Editar Avatar:</label>
            <div className="avatar-selector">
              {avatarList.map((avatarPath, index) => (
                <img
                  key={index}
                  src={avatarPath}
                  alt={`Avatar ${index + 1}`}
                  onClick={() => setAvatar(avatarPath)}
                  className={avatar === avatarPath ? "selected" : ""}
                  style={{
                    width: "80px",
                    height: "80px",
                    cursor: "pointer",
                    margin: "10px",
                    border: avatar === avatarPath ? "2px solid blue" : "none",
                    borderRadius: "10px",
                  }}
                />
              ))}
            </div>
            {errors.avatar && <p className="error">{errors.avatar}</p>}

            {errors.backend && <p className="error">{errors.backend}</p>}

            <button type="submit">Actualizar Perfil</button>
            <button type="button" onClick={() => setShow(false)}>  Cancelar </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
