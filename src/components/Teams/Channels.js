import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { Link, useMatch, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { MdOutlineInfo, MdSettings } from "react-icons/md";
import UserContext from "../../context/user/UserContext";
import { db } from "../../firebase";
import TeamContext from "../../context/team/TeamContext";
import ProfileImage from "../ProfileImage";

const Channels = ({ channelList }) => {
  const { teamId } = useParams();
  const match = useMatch("/teams/:teamId/channels/:channelId");
  const matchChannelId = match?.params?.channelId;
  const channelId = matchChannelId === "new" ? null : matchChannelId;
  const teamContext = useContext(TeamContext);
  const userContext = useContext(UserContext);
  const { uid } = userContext;
  const { teams } = teamContext;
  const [teamInfoToggle, setTeamInfoToggle] = useState(false);

  if (teams.length === 0) {
    return <div>Loading...</div>;
  }
  const teamDetails = teams.find((team) => team.id === teamId);

  const { name: teamName, channels, joinID } = teamDetails;
  return (
    <div className=" w-2/6 max-w-sm pt-4 h-full bg-gray-100">
      <div className="px-4 ">
        <div className="flex items-center cursor-pointer hover:bg-gray-100 w-fit pr-2 rounded">
          <IoIosArrowBack size={15} />
          <Link to={"/teams"}>
            <div className="ml-2">All Teams</div>
          </Link>
        </div>
      </div>

      <div className="mt-5 px-4">
        <ProfileImage size={"l"} value={teamName} />
        <div className="mt-4 flex items-center justify-between ">
          <div className=" text-xl font-bold"> {teamName}</div>
          <div className="mt-4 flex items-center">
            <div
              className="cursor-pointer mr-4"
              onClick={() => setTeamInfoToggle((toggle) => !toggle)}
              title="Team Info"
            >
              <MdOutlineInfo />
            </div>
            <Link to={`/teams/${teamId}/settings`}>
              <div className="cursor-pointer mr-4 text-lg">
                <MdSettings />
              </div>
            </Link>
            <Link to={`/teams/${teamId}/channels/new`}>
              <div className="border-2 border-gray-300 px-2 py-1 text-sm flex items-center cursor-pointer hover:bg-gray-100">
                <AddIcon fontSize="small" />
                Add Channel
              </div>
            </Link>
          </div>
        </div>
      </div>
      {teamInfoToggle && (
        <div className="bg-gray-100 flex py-2 px-4 my-2 justify-between items-center">
          <div>
            <strong>Team Join ID:</strong> {joinID}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setTeamInfoToggle((toggle) => !toggle)}
          >
            <FaTimes />
          </div>
        </div>
      )}

      <div className="mt-4 ">
        {channelList &&
          channelList.length > 0 &&
          channelList.map((channel) => {
            let active = false;
            if (channel.id === channelId) active = true;
            return (
              <Link
                to={`/teams/${teamId}/channels/${channel.id}`}
                key={channel.id}
              >
                <div
                  key={channel.id}
                  className={`px-4 my-2 cursor-pointer hover:bg-gray-50 ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  {channel.name}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Channels;
