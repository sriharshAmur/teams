import React, { useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import UserContext from "../../../context/user/UserContext";
import Switch from "@mui/material/Switch/Switch";

const NewChannel = () => {
  const [user] = useAuthState(auth);
  let navigate = useNavigate();
  const userContext = useContext(UserContext);
  const { name: username } = userContext;
  const { teamId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  //   const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  //   const [typedMember, setTypedMember] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (name === "") {
      setError("Name can't be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    const uid = user.uid;
    const email = user.email;
    const channelObj = {
      name,
      description,
      createdAt: serverTimestamp(),
      createdBy: uid,
      // members: [{ id: uid, name: username, email, role: "owner" }],
    };
    const channelRef = await addDoc(
      collection(db, "test-team", teamId, "channels"),
      channelObj
    );
    const teamRef = doc(db, "test-team", teamId);
    await updateDoc(teamRef, {
      channels: arrayUnion({ id: channelRef.id, name }),
    });
    navigate(`/teams/${teamId}/channels/${channelRef.id}`);
  };
  return (
    <div className="h-full p-5  m-4">
      <div className="text-2xl  my-4 ">Create Channel</div>
      <form>
        <div className="mt-4 ">
          <div className="my-4">
            <div className="font-semibold text-base">Channel name</div>
            <div className="mt-1">
              <input
                className="border-2 w-96 py-1 px-2  text-sm"
                placeholder="Enter Channel name..."
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

export default NewChannel;
