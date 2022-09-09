import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { MdPersonAdd } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import TeamContext from "../../context/team/TeamContext";
import { db } from "../../firebase";

const ChannelInfo = () => {
  const { teamId, channelId } = useParams();
  const [description, setDescription] = useState("");
  const teamContext = useContext(TeamContext);
  const { members } = teamContext;

  useEffect(() => {
    (async () => {
      const channelRef = doc(db, "test-team", teamId, "channels", channelId);
      const docSnap = await getDoc(channelRef);

      const data = docSnap.data();
      setDescription(data.description);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, channelId]);

  return (
    <div className=" pt-2 w-[20vw] border-l-2 p-4">
      <div className="mb-8">
        <div className="font-bold my-2 text-sm">About</div>
        <div className="text-sm">{description}</div>
      </div>
      <div className="mb-8">
        <div className="my-2 flex justify-between items-center">
          <div className="font-bold  text-sm">Members ({members?.length})</div>
          <div className="text-lg cursor-pointer">
            <MdPersonAdd />
          </div>
        </div>
        <div>
          {members?.map((member) => {
            return (
              <div className="my-4">
                <div className="flex items-center">
                  <div className="mr-2">{member.name}</div>
                  <div className="text-sm px-1  text-gray-500 bg-gray-200">
                    {member.role}
                  </div>
                </div>
                <div className="text-sm text-blue-800">{member.email}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Link to={`/teams/${teamId}/settings`}>
          <div className="text-sm text-blue-700 cursor-pointer">
            See all members
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ChannelInfo;
