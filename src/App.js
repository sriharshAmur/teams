import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import SideBar from "./components/nav/SideBar";
import TopNav from "./components/nav/TopNav";
import TeamsPage from "./pages/TeamsPage";
import ChatsPage from "./pages/ChatsPage";
import AuthPage from "./pages/AuthPage";
import { auth } from "./firebase";

import UserState from "./context/user/UserState";
import { useContext, useEffect } from "react";
import UserContext from "./context/user/UserContext";
import TeamState from "./context/team/TeamState";
import ChatState from "./context/chat/ChatState";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

// require("dotenv").config();
// l
function App() {
  return (
    <UserState>
      <TeamState>
        <ChatState>
          <Router>
            <div className="h-screen max-h-screen min-h-screen ">
              <div className=" flex flex-col w-full h-full ">
                <TopNav />
                <Routes>
                  <Route path="/auth/*" element={<AuthPage />} />
                  <Route path="/" exact element={<HomePage />} />
                  <Route
                    path={"/teams/*" || "/chats/*"}
                    element={<TeamsApp />}
                  />
                  <Route path="/*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </Router>
        </ChatState>
      </TeamState>
    </UserState>
  );
}

const TeamsApp = () => {
  const [user, loading, error] = useAuthState(auth);
  let navigate = useNavigate();
  const userContext = useContext(UserContext);
  const { loadUserDetails } = userContext;
  useEffect(() => {
    if (user !== null) {
      console.log(user);
      loadUserDetails(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return <div>Loading....</div>;
  } else if (user) {
    return (
      <div className=" flex-1 flex w-full h-full max-h-[94vh]">
        <SideBar />
        <div className="flex-1 h-full">
          <Routes>
            <Route path="/teams/*" element={<TeamsPage />} />
            <Route path="/chats/*" element={<ChatsPage />} />
          </Routes>
        </div>
      </div>
    );
  } else if (error) {
    return <div>Error....</div>;
  } else {
    console.log("TeamsApp no return from auth");
    navigate(`/auth/login`);
    return <AuthPage />;
  }
};

export default App;
