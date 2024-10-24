import React from "react";
import "./AppBar.style.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button.component";
import { useAuth } from "../../contexts/userAuthContext";
import { logoutUser } from "../../firebase/firebase.config";

const AppBar: React.FC = () => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/feeds"); // Redirect to login after logging out
    } catch (err) {
      console.error("Error during sign out:", err);
    }
  };

  // Handle navigation to login/register when logged out
  const handleLogin = () => {
    navigate("/login");
  };

  // Navigate to the user's profile page
  const handleProfileClick = () => {
    if (currentUser?.uid) {
      navigate(`/user/${currentUser.uid}`); // Navigate to the user's profile page
    }
  };

  const handleMessage = () => {
    navigate("/chat");
  };

  return (
    <div className='app-bar'>
      <div className='logo' onClick={() => navigate("/")}>
        MySocialApp
      </div>

      <div className='nav-items '>
        {currentUser ? (
          <div className='logged-in-container'>
            <span
              className='username'
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            >
              Welcome {currentUser.displayName || "User"}
            </span>
            <Button
              label='chat'
              onClick={handleMessage}
              style='secondary'
              icon='🔔'
            />
            <Button label='Logout' onClick={handleLogout} style='secondary' />
          </div>
        ) : (
          <div className='logged-out-container'>
            <Button
              label='Login/Register'
              onClick={handleLogin}
              style='secondary'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppBar;
