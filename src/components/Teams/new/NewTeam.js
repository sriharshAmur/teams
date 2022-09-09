import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import UserContext from "../../../context/user/UserContext";

const NewTeam = () => {
  const [joinID, setJoinID] = useState("");
  let navigate = useNavigate();
  const userContext = useContext(UserContext);
  const { uid, name, email } = userContext;

  const joinTeam = async (e) => {
    e.preventDefault();
    const teamsRef = collection(db, "test-team");
    const q = query(teamsRef, where("joinID", "==", joinID));
    const docSnap = await getDocs(q);
    docSnap.forEach(async (docu) => {
      const data = docu.data();
      const teamId = docu.id;
      const teamName = data.name;
      const member = {
        id: uid,
        name,
        email,
        role: "member",
      };
      const teamRef = doc(db, "test-team", teamId);
      await updateDoc(teamRef, {
        members: arrayUnion(member),
      });
      addTeamInUser(teamId, teamName);
      navigate(`/teams/${teamId}/channels/`);
    });
  };

  const addTeamInUser = async (teamId, teamName) => {
    const userDocRef = doc(db, "test-user", uid);
    await updateDoc(userDocRef, {
      [`teams.${teamId}`]: teamName,
    });
  };
  return (
    <div className=" h-full p-5  m-4">
      <div className="flex items-center cursor-pointer p-1 hover:bg-gray-100 w-fit pr-2 rounded">
        <IoIosArrowBack size={15} />
        <Link to={"/teams"}>
          <div className="ml-2">Back</div>
        </Link>
      </div>
      <div className="text-2xl  my-4 ">Join or Create a New Team</div>
      <div className="flex ">
        <div className=" mr-8 w-96 flex flex-col items-center justify-center border-2 rounded  ">
          <div>Create a Team</div>
          <Link to="create">
            <button className="border-2 py-2 px-4 mt-4 hover:bg-blue-700 hover:text-white">
              Create team
            </button>
          </Link>
        </div>
        <form
          onSubmit={joinTeam}
          className=" w-96 flex flex-col  items-center p-20 border-2  rounded "
        >
          Join a Team
          <input
            className="border-2 px-2 py-1 my-4"
            placeholder="Enter Team Code"
            type={"number"}
            value={joinID}
            onChange={(e) => setJoinID(parseInt(e.target.value))}
            onEmptied={() => setJoinID("")}
          />
          <button
            type="submit"
            className="border-2 py-2 px-4  cursor-pointer hover:bg-blue-700 hover:text-white"
          >
            Join Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTeam;
