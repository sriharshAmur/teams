import React from "react";

import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const ChannelItem = ({ channel, owner, teamId, removeChannel }) => {
  return (
    <div
      key={channel.id}
      className="flex justify-between items-center my-2 px-4 py-2   bg-white "
    >
      <div className="flex-1">
        <div className="hover:underline w-fit">
          <Link to={`/teams/${teamId}/channels/${channel.id}`}>
            {channel.name}
          </Link>
        </div>
      </div>
      <div className=" flex-1 ">
        {channel.description.length > 150
          ? channel.description.slice(0, 150).concat("...")
          : channel.description}
      </div>
      <div className=" flex-1">{channel.type || "Public"}</div>
      <div className="flex-1 ">
        {owner && channel.name !== "General" ? (
          <div
            className="ml-auto w-fit cursor-pointer"
            onClick={() => removeChannel(channel)}
          >
            <FaTimes />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ChannelItem;
