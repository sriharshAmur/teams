import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import UserContext from "../../context/user/UserContext";
import ProfileImage from "../ProfileImage";

const Teams = () => {
  // const [teams, setTeams] = useState([]);
  const [user] = useAuthState(auth);
  const userContext = useContext(UserContext);
  const { teams, name } = userContext;

  useEffect(() => {}, []);

  return (
    <div className=" overflow-auto h-full p-5  ">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold m-4">Teams</div>
        <Link to="new">
          <div className="border-2 px-2 py-1 hover:bg-gray-200 cursor-pointer">
            <AddIcon />
            Create or Join a Team
          </div>
        </Link>
      </div>
      <div className="flex justify-start items-center flex-wrap ">
        {teams.length > 0 ? (
          teams.map((team) => {
            return (
              <Link to={`${team.id}`} key={team.id}>
                <div
                  key={team.id}
                  className="p-20 border-2 m-4 rounded cursor-pointer hover:bg-gray-200"
                >
                  {team.name}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="ml-4 ">
            No Teams Found, Try creating or joining one .
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
