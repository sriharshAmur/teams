import SearchIcon from "@mui/icons-material/Search";
import {
  arrayRemove,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdDeleteForever, MdPersonAdd, MdPersonRemove } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChatContext from "../../../context/chat/ChatContext";
import UserContext from "../../../context/user/UserContext";
import { auth, db } from "../../../firebase";
import MemberItem from "./MemberItem";

const ChatInfo = () => {
  const [user] = useAuthState(auth);
  const { chatId } = useParams();
  const [description, setDescription] = useState("");
  const chatContext = useContext(ChatContext);
  const { members, joinID, owner, createdBy } = chatContext;
  const [search, setSearch] = useState("");
  const userContext = useContext(UserContext);
  const { uid, loadUserDetails } = userContext;
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const chatRef = doc(db, "test-chat", chatId);
      const docSnap = await getDoc(chatRef);

      const data = docSnap.data();
      setDescription(data.description);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const deleteTeam = async () => {
    // remove all messages
    const messageRef = collection(db, "test-chat", chatId, "messages");
    const messageDocs = await getDocs(messageRef);
    messageDocs.forEach(async (message) => {
      const messageDoc = doc(db, "test-chat", chatId, "messages", message.id);
      await deleteDoc(messageDoc);
    });
    // remove chat document
    const chatRef = doc(db, "test-chat", chatId);
    await deleteDoc(chatRef);
    // remove chat from member/user
    members.forEach(async (member) => {
      const userRef = doc(db, "test-user", member.id);
      await updateDoc(userRef, {
        [`chats.${chatId}`]: deleteField(),
      });
    });
    loadUserDetails(user);
    navigate(`/chats`);
  };

  const removeMember = async (member) => {
    // remove member from all channels
    const chatRef = doc(db, "test-chat", chatId);
    const memberObj = {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
    };
    await updateDoc(chatRef, {
      members: arrayRemove(memberObj),
    });
    // remove team from member/user
    const userRef = doc(db, "test-user", member.id);
    await updateDoc(userRef, {
      [`chats.${chatId}`]: deleteField(),
    });

    if (members.length === 1) {
      deleteTeam();
    }

    // check if leave team and navigate
    if (member.id === uid) {
      loadUserDetails(user);
      navigate(`/teams`);
    }
  };

  return (
    <div className=" pt-2 w-[20vw] border-l-2 p-4 overflow-hidden h-[85vh] flex flex-col">
      <div className="pb-4 border-b-2 border-gray-300">
        <div className="my-1 flex justify-between items-end">
          <div className="font-bold  text-sm">About</div>
          <div className="text-lg cursor-pointer">
            <div
              className="text-sm border-2 px-2   rounded bg-blue-200 cursor-pointer"
              title="Copy"
            >
              Join ID: {joinID}
            </div>
          </div>
        </div>
        <div className="text-sm">{description}</div>
      </div>
      <div className="flex justify-between w-full mt-4 pb-4  border-b-2 border-gray-300">
        <div
          className="flex cursor-pointer  items-center px-4 py-1 text-sm rounded bg-blue-600  text-white "
          onClick={() => removeMember(members.find((m) => m.id === uid))}
        >
          <MdPersonRemove size={15} />
          <div className="ml-2 ">Leave Team</div>
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
      <div className="my-4 flex justify-between items-center">
        <div className="font-bold  text-sm">Members ({members?.length})</div>
        <div className="text-lg cursor-pointer">
          <MdPersonAdd />
        </div>
      </div>
      <div className=" flex items-center  rounded w-full mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for Members..."
          className="px-4 pr-2 py-2 text-sm outline-none flex-1 rounded"
        />
        <div className="pr-2 self-stretch flex items-center bg-white ">
          <SearchIcon />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {search !== "" ? (
          <div className="mt-4">
            <MemberItem
              type={""}
              creator={createdBy}
              removeMember={removeMember}
              owner={owner}
              uid={uid}
              members={members.filter((member) =>
                (member.name || member.email)
                  .toUpperCase()
                  .includes(search.toUpperCase())
              )}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="font-semibold mb-2">
                Owners (
                {members?.filter((member) => member.role === "owner").length})
              </div>
              <div className="mt-4">
                <MemberItem
                  uid={uid}
                  type={"owner"}
                  members={members}
                  creator={createdBy}
                  removeMember={removeMember}
                  owner={owner}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">
                Members (
                {members?.filter((member) => member.role === "member").length})
              </div>

              <MemberItem
                uid={uid}
                members={members}
                type={"member"}
                creator={createdBy}
                removeMember={removeMember}
                owner={owner}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInfo;
