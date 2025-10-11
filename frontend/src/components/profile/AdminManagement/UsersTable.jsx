import React, { useEffect, useState, useContext } from "react";
import Search from "../../search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { errorToast, successToast } from "../../toast/NotificationToast";
import { showConfirmAlert } from "../../sweetAlert/ConfirmAlert";
import "sweetalert2/dist/sweetalert2.min.css";

import { useFetch } from "../../hook/UseFetch.js";
import { AuthenticationContext } from "../../services/auth.context";

const UsersTable = () => {
  const { getAll, put, del } = useFetch("/users");
  const { token, userId } = useContext(AuthenticationContext);
  const [allUsers, setAllUsers] = useState([]);
  const [editedRole, setEditedRole] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsersData = async () => {
      if (!token) return; // Por si token no está disponible
      try {
        const usersData = await getAll(token);
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        errorToast("Error al cargar usuarios");
      }
    };

    fetchUsersData();
  }, [token]);

  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRole = (id, currentRole) => {
    setEditingUserId(id);
    setEditedRole(currentRole);
  };

  const handleSaveRole = async (id) => {
    if (userId === id) {
      errorToast("No es posible cambiar tu propio rol.");
      return;
    }

    try {
      await put({ role: editedRole }, id, token);

      const updatedUsers = allUsers.map((u) =>
        u.id === id ? { ...u, role: editedRole } : u
      );
      setAllUsers(updatedUsers);

      setEditingUserId(null);
      setEditedRole(null);

      successToast("Rol actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      errorToast("Error al actualizar el rol");
    }
  };

  const handleDeleteUser = (id) => {
    showConfirmAlert(id, async (idToDelete) => {
      try {
        const deleted = await del(idToDelete, token);
        if (deleted) {
          const updatedUsers = allUsers.filter((u) => u.id !== idToDelete);
          setAllUsers(updatedUsers);
          successToast("Usuario eliminado correctamente");
        }
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        errorToast("Error eliminando usuario");
      }
    });
  };

  return (
    <>
      <Search
        onSearch={setSearchTerm}
        placeholder="Buscar Username o email..."
      />

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    {editingUserId === u.id ? (
                      <select
                        className="select-gender"
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      >
                        <option value="superadmin">superadmin</option>
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td>
                    {editingUserId === u.id ? (
                      <button
                        className="btn-save"
                        onClick={() => handleSaveRole(u.id)}
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        className="btn-edit"
                        onClick={() => handleEditRole(u.id, u.role)}
                        disabled={userId === u.id}
                        title={
                          userId === u.id
                            ? "Este usuario sos vos"
                            : "Editar rol de usuario"
                        }
                      >
                        Editar rol
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(u.id)}
                      title={
                        userId === u.id
                          ? "Este usuario sos vos"
                          : "Eliminar Usuario"
                      }
                      disabled={userId === u.id}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UsersTable;
