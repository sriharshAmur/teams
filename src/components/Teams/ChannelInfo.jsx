import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { MdPersonAdd } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import TeamContext from "../../context/team/TeamContext";
import { db } from "../../firebase";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const ChannelInfo = ({ channel }) => {
  const { teamId, channelId } = useParams();
  const teamContext = useContext(TeamContext);
  const { teams } = teamContext;
  const team = teams.find((team) => team.id === teamId);
  const { members: memberIDs } = team;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMeberDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const getMeberDetails = async () => {
    const userRef = collection(db, "test-user");
    const memberIds = memberIDs.map((member) => member.id);
    const q = query(userRef, where(documentId(), "in", memberIds));
    const querySnapshot = await getDocs(q);
    let memberArr = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      const member = {
        id: doc.id,
        name: data.name,
        email: data.email,
        inVideoCall: data.inVideoCall,
        role: memberIDs.find((member) => member.id === doc.id).role,
      };
      memberArr.push(member);
    });
    setMembers(memberArr);
  };

  return (
    <div className=" pt-2 w-[20vw] border-l-2 p-4">
      <div className="mb-8">
        <div className="font-bold my-2 text-sm">About</div>
        <div className="text-sm">{channel.description}</div>
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
              <div className="my-4" key={member.id}>
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
