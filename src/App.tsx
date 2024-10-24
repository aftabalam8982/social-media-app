import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feeds from "./pages/feed/Feeds";
import AppBar from "./pages/appbar/AppBar.page";
import LoginRegisterPage from "./pages/login-register/LoginAndRegister.page";
import UserProfilePage from "./pages/userpage/User.page";
import ChatUI from "./pages/chat/ChatUi.page";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <AppBar />
        <Routes>
          <Route path='/' element={<Feeds />} />
          <Route path='/feeds' element={<Feeds />} />
          <Route path='/login' element={<LoginRegisterPage />} />
          <Route path='/chat' element={<ChatUI />} />
          <Route path='/user/:userId' element={<UserProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
