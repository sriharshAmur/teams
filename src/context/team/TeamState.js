import React, { useReducer } from "react";
import TeamReducer from "./TeamReducer";
import TeamContext from "./TeamContext";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

import { CLEAR_TEAM, LOAD_TEAM_DETAILS } from "../types";
import { useEffect } from "react";
import UserContext from "../user/UserContext";
import { useContext } from "react";

const TeamState = ({ children }) => {
  const userContext = useContext(UserContext);
  const { teams: teamIds } = userContext;

  const initialState = [];
  const [state, dispatch] = useReducer(TeamReducer, initialState);

  const setTeamDetails = (data) => {
    dispatch({ type: LOAD_TEAM_DETAILS, payload: data });
  };

  const clearTeam = () => {
    dispatch({ type: CLEAR_TEAM });
  };

  useEffect(() => {
    // fetch team names here
    let unsubscribe = () => {};

    if (teamIds.length > 0) {
      const teamsRef = collection(db, "test-team");
      const q = query(teamsRef, where(documentId(), "in", teamIds));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const teamDetailsArray = [];
        querySnapshot.forEach((doc) => {
          teamDetailsArray.push({ ...doc.data(), id: doc.id });
        });
        setTeamDetails(teamDetailsArray);
      });
    }

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(teamIds)]);
  return (
    <TeamContext.Provider
      value={{
        teams: state,

        clearTeam,
        setTeamDetails,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export default TeamState;
