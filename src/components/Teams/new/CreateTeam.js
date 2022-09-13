import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  serverTimestamp,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import UserContext from "../../../context/user/UserContext";

const CreateTeam = () => {
  let navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  //   const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  //   const [typedMember, setTypedMember] = useState("");
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
    const teamObj = {
      name,
      description,
      createdAt: serverTimestamp(),
      createdBy: uid,
      joinID,
      channels: [],
      members: [],
    };
    const docRef = await addDoc(collection(db, "test-team"), teamObj);
    addTeamInUser(docRef.id);
    addChannelsInTeams(docRef.id);
  };

  const addChannelsInTeams = async (teamId) => {
    const channelObj = {
      name: "General",
      description: "This is the General Channel",
      createdAt: serverTimestamp(),
      createdBy: uid,
    };
    // Make General Channel in the Team
    const channelRef = await addDoc(
      collection(db, "test-team", teamId, "channels"),
      channelObj
    );

    // Add General Channel to the ChannelList in Team
    const teamRef = doc(db, "test-team", teamId);
    await updateDoc(teamRef, {
      id: teamId,
      channels: arrayUnion(channelRef.id),
      members: arrayUnion({
        id: uid,
        role: "owner",
      }),
    });
    loadUserDetails(user);
    // need to wait a bit before navigating to the team
    navigate(`/teams/${teamId}/channels/${channelRef.id}`);
  };

  const addTeamInUser = async (teamId) => {
    const userDocRef = doc(db, "test-user", uid);
    await updateDoc(userDocRef, {
      teams: arrayUnion(teamId),
    });
  };

  return (
    <div className="h-full p-5  m-4">
      <div className="flex items-center cursor-pointer p-1 hover:bg-gray-100 w-fit pr-2 rounded">
        <IoIosArrowBack size={15} />
        <Link to={"/teams/new"}>
          <div className="ml-2">Back</div>
        </Link>
      </div>
      <div className="text-2xl  my-4 ">Create Team</div>
      <form>
        <div className="mt-4 ">
          <div className="my-4">
            <div className="font-semibold text-base">Team name</div>
            <div className="mt-1">
              <input
                className="border-2 w-96 py-1 px-2  text-sm"
                placeholder="Enter Team name..."
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
    </div>
  );
};

export default CreateTeam;
