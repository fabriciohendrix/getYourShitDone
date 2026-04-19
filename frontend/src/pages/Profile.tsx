import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Profile</h2>
      <div>
        <b>Name:</b> {user.name}
      </div>
      <div>
        <b>Email:</b> {user.email}
      </div>
      <button
        className="btn btn-error mt-4"
        onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};
export default Profile;
