import React, { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ChannelItem from "./ChannelItem";

const Channels = ({ channels, owner, removeChannel }) => {
  const { teamId } = useParams();
  const [search, setSearch] = useState("");
  return (
    <div className="mb-4 overflow-auto">
      <div className="flex justify-between mb-4">
        <div className=" flex items-center  rounded">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Channels..."
            className="px-4 pr-2 py-2 text-sm outline-0"
          />
          <div className="pr-2 self-stretch flex items-center cursor-pointer bg-white ">
            <SearchIcon />
          </div>
        </div>
        <Link to={`/teams/${teamId}/channels/new`}>
          <div className="flex cursor-pointer  items-center px-2 py-2 text-sm rounded bg-blue-600 text-white ">
            <FaPlusSquare size={15} />
            <div className="ml-2">Add Channel</div>
          </div>
        </Link>
      </div>
      <div className="mt-4">
        <div className=" mx-4 mb-2 flex justify-between text-sm text-gray-700">
          <div className="flex-1">Name</div>
          <div className="flex-1">Description</div>
          <div className="flex-1">Type</div>
          <div className="flex-1"></div>
        </div>
        <div className="">
          {search !== ""
            ? channels
                .filter((channel) =>
                  (channel.name || channel.description)
                    .toUpperCase()
                    .includes(search.toUpperCase())
                )
                .map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    teamId={teamId}
                    channel={channel}
                    owner={owner}
                    removeChannel={removeChannel}
                  />
                ))
            : channels.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  teamId={teamId}
                  channel={channel}
                  owner={owner}
                  removeChannel={removeChannel}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Channels;
