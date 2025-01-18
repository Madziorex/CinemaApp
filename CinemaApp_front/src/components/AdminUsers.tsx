import React, { useEffect, useState } from "react";
import api from "../services/api";
import PopupForm from "./PopupForm";
import "../css/AdminUsers.css";
import { useAuth } from "../services/AuthContext";
import LoadingIcon from "./LoadingIcon";

interface User {
  id: string;
  userName: string;
  email: string;
  role: number;
}

interface UsersResponse {
  items: User[];
  pageIndex: number;
  totalPages: number;
}

const AdminUsers: React.FC = () => {
  const { nameidentifier } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<number>(2);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentUserId, setCurrentUserId] =
    useState<string>("<CURRENT_ADMIN_ID>");

  const fetchUsers = async (page: number, query: string) => {
    setLoading(true);
    setError(null);

    try {
      const searchBy = query.includes("@") ? "email" : "userName";
      const response = await api.get<UsersResponse>("/User", {
        params: {
          pageIndex: page,
          pageSize: 10,
          searchBy: searchBy,
          searchFor: query,
          orderBy: "email",
          ascending: true,
        },
      });
      setUsers(response.data.items);
      setPageIndex(response.data.pageIndex);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pageIndex, searchQuery);
  }, [pageIndex, searchQuery]);

  const handleEditRole = (user: User) => {
    setEditingUser(user);
    setNewRole(user.role);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    if (nameidentifier) {
      setCurrentUserId(nameidentifier);
    }
  }, [nameidentifier]);

  const handleSaveRole = async () => {
    if (!editingUser) return;

    try {
      await api.put(`/User/${editingUser.id}`, { role: newRole });
      alert("Role updated successfully.");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, role: newRole } : user
        )
      );

      setEditingUser(null);
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role. Please try again.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUserId) {
      alert("You cannot delete yourself.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/User/${userId}`);
      alert("User deleted successfully.");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPageIndex(0);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!users.length) {
    return <div>No users found.</div>;
  }

  return (
    <div className="admin-users-container">
      <div className="title-and-button">
        <h1 className="title">Users Management</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by email or Username"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="users-list">
        <div className="movie-header">
            <span>ID</span>
            <span>Username</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
        </div>
        {loading ? (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      ) : (
        <>
          {users.map((user) => (
            <div key={user.id} className="movie-row">
              <span>{user.id}</span>
              <span>{user.userName}</span>
              <span>{user.email}</span>
              <span>
                {user.role === 0
                  ? "Admin"
                  : user.role === 1
                  ? "Employee"
                  : "Client"}
              </span>
              <div className="button-group">
                {user.id !== currentUserId && (
                  <>
                    <button
                      onClick={() => handleEditRole(user)}
                      className="edit-button"
                      disabled={user.id === currentUserId}
                    >
                      Edit Role
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-button"
                      disabled={user.id === currentUserId}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="pagination-button"
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex + 1 === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      <PopupForm
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Edit User Role"
      >
        {editingUser && (
          <div className="user-form-container">
            <div className="form-group">
            <p>
              Editing role for: <strong>{editingUser.userName}</strong>
            </p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(Number(e.target.value))}
            >
              <option value={0}>Admin</option>
              <option value={1}>Employee</option>
              <option value={2}>Client</option>
            </select>
            </div>
            <div className="popup-actions">
              <button onClick={handleSaveRole} className="submit-button">
                Save
              </button>
            </div>
          </div>
        )}
      </PopupForm>
    </div>
  );
};

export default AdminUsers;
