import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Channel from "../components/Teams/Channel";
import Channels from "../components/Teams/Channels";
import CreateTeam from "../components/Teams/new/CreateTeam";
import NewChannel from "../components/Teams/new/NewChannel";
import NewTeam from "../components/Teams/new/NewTeam";
import Settings from "../components/Teams/Settings/Settings";
import Teams from "../components/Teams/Teams";
import ChannelVideo from "../components/video/ChannelVideo";
import TeamContext from "../context/team/TeamContext";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const TeamsPage = () => {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<Teams />} />
        <Route path="/new" element={<NewTeam />} />
        <Route path="/new/create" element={<CreateTeam />} />
        <Route path=":teamId/*" element={<ChannelsPage />} />
      </Routes>
    </div>
  );
};

const ChannelsPage = () => {
  const { teams } = useContext(TeamContext);
  const { teamId } = useParams();
  const [channelList, setChannelList] = useState([]);
  let navigate = useNavigate();

  // check if the user is part of the team
  // can also fetch channel details here and store them in a context
  useEffect(() => {
    let unsubscribe = () => {};
    if (teams.length > 0) {
      const team = teams.find((team) => team.id === teamId);
      if (!team) {
        console.log("You are not part of this team");
        navigate(`/teams`);
      } else {
        const channelsRef = collection(db, "test-team", teamId, "channels");
        const q = query(channelsRef, orderBy("createdAt", "asc"));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          let channelArr = [];
          querySnapshot.forEach((docu) => {
            const data = docu.data();
            const channelId = docu.id;
            const channelName = data.name;
            const channelDescription = data.description;
            channelArr.push({
              id: channelId,
              name: channelName,
              description: channelDescription,
            });
          });
          setChannelList(channelArr);
        });
      }
    }
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, teams]);

  if (teams.length === 0) {
    return <div>Loadind...</div>;
  }
  if (channelList.length === 0) {
    return <div>Loading channels in this team</div>;
  }

  return (
    <div className=" flex h-full">
      <Channels channelList={channelList} />
      <Routes>
        <Route
          path="/settings"
          element={<Settings channelList={channelList} />}
        />
        <Route path="/channels/new" element={<NewChannel />} />
        <Route
          path="/channels/:channelId"
          element={<Channel channelList={channelList} />}
        />
        <Route path="/channels/:channelId/video" element={<ChannelVideo />} />
      </Routes>
    </div>
  );
};

export default TeamsPage;
