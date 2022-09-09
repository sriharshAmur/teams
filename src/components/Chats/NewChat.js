import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import { auth, db } from "../../firebase";

const NewChat = () => {
  let navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [joinID, setJoinID] = useState("");

  const userContext = useContext(UserContext);
  const { uid, name: username, email, loadUserDetails } = userContext;

  const submit = async (e) => {
    e.preventDefault();
    if (name === "") {
      setError("Name can't be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    const joinID = Math.floor(100000 + Math.random() * 900000);
    const chatObj = {
      name,
      description,
      createdAt: serverTimestamp(),
      createdBy: uid,
      joinID,
      members: [
        {
          id: uid,
          name: username,
          email: email,
          role: "owner",
        },
      ],
    };
    const docRef = await addDoc(collection(db, "test-chat"), chatObj);
    addChatInUser(docRef.id);
    loadUserDetails(user);
    navigate(`/chats/${docRef.id}`);
  };

  const addChatInUser = async (id) => {
    const userDocRef = doc(db, "test-user", uid);
    await updateDoc(userDocRef, {
      [`chats.${id}`]: name,
    });
  };

  const joinChat = async (e) => {
    e.preventDefault();
    const chatsRef = collection(db, "test-chat");
    const q = query(chatsRef, where("joinID", "==", joinID));
    const docSnap = await getDocs(q);
    docSnap.forEach(async (docu) => {
      const data = docu.data();
      console.log(data);
      const chatId = docu.id;
      const chatName = data.name;
      const member = {
        id: uid,
        name: username,
        email,
        role: "member",
      };
      const chatRef = doc(db, "test-chat", chatId);
      await updateDoc(chatRef, {
        members: arrayUnion(member),
      });
      addTeamInUser(chatId, chatName);
      loadUserDetails(user);
      navigate(`/chats/${chatId}`);
    });
  };

  const addTeamInUser = async (chatId, chatName) => {
    const userDocRef = doc(db, "test-user", uid);
    await updateDoc(userDocRef, {
      [`chats.${chatId}`]: chatName,
    });
  };

  return (
    <div className="h-full  p-7">
      <div className="text-2xl mt-4  ">Create Chat</div>
      <form className="pb-8  border-b-2 border-gray-400">
        <div className="mt-4 ">
          <div className="my-4">
            <div className="font-semibold text-base">Chat Name</div>
            <div className="mt-1">
              <input
                className="border-2 w-96 py-1 px-2  text-sm"
                placeholder="Enter Chat name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="text-sm text-red-600">{error}</div>
          </div>
          <div>
            <div className="font-semibold text-base">Description</div>
            <div>
              <textarea
                className="border-2 w-96 py-2 px-2 text-sm"
                placeholder="Enter Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* <div>
            <div className="font-semibold text-base">Add Members</div>
            <div>
            <Autocomplete
              value={typedMember}
              disablePortal
              onChange={(value) => {
                console.log(value.target);
                //   setMembers((members) => [...members, value]);
                setTypedMember("");
              }}
              getOptionLabel={(obj) => {
                console.log("Önject", obj);
                return obj.name;
              }}
              id="combo-box-demo"
              options={membersArr}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
            <div>{members}</div>
          </div> */}
        </div>
        <button
          type="submit"
          className=" text-center border-2 py-2 px-4 mt-4 hover:bg-blue-700 hover:text-white"
          onClick={(e) => submit(e)}
        >
          Create
        </button>
      </form>

      {/* <div className="my-8 text-blue-700 text-sm">or Join an existing Chat</div> */}
      <form onSubmit={joinChat} className=" mt-8 ">
        <div className="text-2xl mb-2 ">Join Chat</div>

        <input
          className="border-2 px-2   py-2 outline-none"
          placeholder="Enter Chat Code"
          type={"number"}
          value={joinID}
          onChange={(e) => setJoinID(parseInt(e.target.value))}
          onEmptied={() => setJoinID("")}
        />
        <button
          type="submit"
          className="border-2 py-2 px-4 ml-4 cursor-pointer hover:bg-blue-700 hover:text-white"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default NewChat;
