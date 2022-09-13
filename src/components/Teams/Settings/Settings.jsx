import {
  collection,
  doc,
  arrayRemove,
  deleteDoc,
  getDocs,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdDeleteForever, MdDone, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import TeamContext from "../../../context/team/TeamContext";
import UserContext from "../../../context/user/UserContext";
import { auth, db } from "../../../firebase";
import ProfileImage from "../../ProfileImage";
import Channels from "./Channels";
import Members from "./Members";

const Settings = ({ channelList }) => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const teamContext = useContext(TeamContext);
  const userContext = useContext(UserContext);
  const { teams } = teamContext;
  const team = teams.find((team) => team.id === teamId);
  const { name, description, createdBy, joinID, members } = team;
  const owner = createdBy === user.uid;
  const { loadUserDetails } = userContext;

  const [tab, setTab] = useState("members");
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");

  const changeTab = (name) => {
    if (tab !== name) {
      setTab(name);
    }
  };

  const removeChannel = async (channelId) => {
    // remove channel from channels subcollection (id)
    const conversationRef = collection(
      db,
      "test-team",
      teamId,
      "channels",
      channelId,
      "conversations"
    );
    const conversationDocs = await getDocs(conversationRef);
    conversationDocs.forEach(async (con) => {
      if (con.exists()) {
        const replyRef = collection(
          db,
          "test-team",
          teamId,
          "channels",
          channelId,
          "conversations",
          con.id,
          "replies"
        );
        const replyDocs = await getDocs(replyRef);
        if (replyDocs.size > 0) {
          replyDocs.forEach(async (reply) => {
            const replyDoc = doc(
              db,
              "test-team",
              teamId,
              "channels",
              channelId,
              "conversations",
              con.id,
              "replies",
              reply.id
            );
            await deleteDoc(replyDoc);
          });
        }
        const conversationDoc = doc(
          db,
          "test-team",
          teamId,
          "channels",
          channelId,
          "conversations",
          con.id
        );

        await deleteDoc(conversationDoc);
      }
    });
    const channelDoc = doc(db, "test-team", teamId, "channels", channelId);
    await deleteDoc(channelDoc);

    const teamRef = doc(db, "test-team", teamId);
    await updateDoc(teamRef, {
      channels: arrayRemove(channelId),
    });
  };

  const deleteTeam = async () => {
    // remove all channls
    channelList.forEach((channel) => {
      removeChannel(channel);
    });
    // remove team document
    const teamRef = doc(db, "test-team", teamId);
    await deleteDoc(teamRef);
    // remove team from member/user
    members.forEach(async (member) => {
      const userRef = doc(db, "test-user", member.id);
      await updateDoc(userRef, {
        // [`teams.${teamId}`]: deleteField(),\
        teams: arrayRemove(teamId),
      });
    });
    loadUserDetails(user);
    navigate(`/teams`);
  };

  const handleEditName = async () => {
    setEditName(false);

    // update Team name
    const teamDoc = doc(db, "test-team", teamId);
    await updateDoc(teamDoc, {
      name: newName,
    });
  };

  return (
    <div className=" w-full overflow-hidden bg-gray-100 pt-4 px-8">
      <div className="flex items-center mb-8">
        <div>
          <ProfileImage size={"l"} value={name} />
        </div>
        <div className="flex justify-between items-center w-full ">
          <div className="ml-4">
            <div className="flex items-center">
              {editName ? (
                <div className=" ">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="outline-0 ml-2 py-2 px-2 bg-gray-200"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="font-semibold text-2xl">{name}</div>
              )}
              {editName ? (
                <div className="ml-2 cursor-pointer " onClick={handleEditName}>
                  <MdDone />
                </div>
              ) : (
                <div
                  className="ml-2 cursor-pointer "
                  onClick={() => {
                    setNewName(name);
                    setEditName(true);
                  }}
                >
                  <MdEdit />
                </div>
              )}
            </div>
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
                onClick={deleteTeam}
              >
                <MdDeleteForever size={20} />
                <div className="ml-2">Delete Team</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-b-2 border-gray-200 mb-4">
        <div
          className={`cursor-pointer font-semibold text-lg  mr-2 ${
            tab === "members"
              ? "border-b-2 border-blue-700"
              : "hover:border-b-2 border-gray-400"
          }`}
          onClick={() => changeTab("members")}
        >
          Members
        </div>
        <div
          className={`cursor-pointer font-semibold text-lg mx-2 ${
            tab === "channels"
              ? "border-b-2 border-blue-700"
              : "hover:border-b-2 border-gray-400"
          }`}
          onClick={() => changeTab("channels")}
        >
          Channels
        </div>
      </div>
      <div className="mb-4 ">
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
      </div>
    </div>
  );
};

export default Settings;
