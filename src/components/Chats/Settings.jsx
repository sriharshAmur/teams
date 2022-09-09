import React, { useContext } from "react";
import { MdDeleteForever } from "react-icons/md";
import ChatContext from "../../context/chat/ChatContext";
import UserContext from "../../context/user/UserContext";
import ProfileImage from "../ProfileImage";

const Settings = () => {
  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);
  const { name, description, createdBy, owner, joinID, members } = chatContext;
  const { uid, loadUserDetails } = userContext;
  return (
    <div className=" w-full overflow-hidden bg-gray-100 pt-4 px-8">
      <div className="flex items-center mb-8">
        <div>
          <ProfileImage size={"l"} value={name} />
        </div>
        <div className="flex justify-between items-center w-full ">
          <div className="ml-4">
            <div className="font-semibold text-2xl">{name}</div>
            <div className="">{description}</div>
          </div>
          <div className="flex">
            <div
              className="text-sm mr-2 border-2 px-2 py-1  rounded bg-blue-200 cursor-pointer"
              title="Copy"
            >
              Join ID: {joinID}
            </div>
            {owner && (
              <div
                className="flex cursor-pointer  items-center px-2 py-1 text-sm rounded bg-red-600 text-white "
                // onClick={deleteTeam}
              >
                <MdDeleteForever size={20} />
                <div className="ml-2">Delete Team</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-b-2 border-gray-200 mb-4"></div>
      {/* <div className="mb-4 ">
        {tab === "members" ? (
          <Members
            creator={createdBy}
            owner={owner}
            members={members}
            deleteTeam={deleteTeam}
          />
        ) : (
          <Channels
            owner={owner}
            creator={createdBy}
            channels={channelList}
            removeChannel={removeChannel}
          />
        )}
      </div> */}
    </div>
  );
};

export default Settings;
