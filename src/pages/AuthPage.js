import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { auth } from "../firebase";

const AuthPage = () => {
  // const [user] = useAuthState(auth);
  // let navigate = useNavigate();
  // useEffect(() => {
  //   if (user !== null) {
  //     navigate(`/teams`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  return (
    <div className="h-full">
      <Routes>
        <Route index path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default AuthPage;
