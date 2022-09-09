import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Route, Routes, useNavigate } from "react-router-dom";
import Chat from "../components/Chats/Chat";
import Chats from "../components/Chats/Chats";
import NewChat from "../components/Chats/NewChat";
import Settings from "../components/Chats/Settings";
import { auth } from "../firebase";

const ChatsPage = () => {
  const [user] = useAuthState(auth);
  let navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate(`/auth/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="h-full w-full flex">
      <Chats />
      <Routes>
        <Route path="/new" element={<NewChat />} />
        <Route path=":chatId" element={<Chat />} />
        <Route path=":chatId/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default ChatsPage;
