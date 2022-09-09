import React, { useReducer } from "react";
import TeamReducer from "./TeamReducer";
import TeamContext from "./TeamContext";

import { CLEAR_TEAM, LOAD_TEAM_DETAILS } from "../types";

const TeamState = ({ children }) => {
  const initialState = {
    name: "",
    description: "",
    createdAt: "",
    createdBy: "",
    channels: [],
    joinID: null,
    members: [],
    owner: false,
  };
  const [state, dispatch] = useReducer(TeamReducer, initialState);

  const setTeamDetails = (data) => {
    dispatch({ type: LOAD_TEAM_DETAILS, payload: data });
  };

  const clearTeam = () => {
    dispatch({ type: CLEAR_TEAM });
  };

  return (
    <TeamContext.Provider
      value={{
        name: state.name,
        description: state.description,
        createdBy: state.createdBy,
        createdAt: state.createdAt,
        owner: state.owner,
        channels: state.channels,
        joinID: state.joinID,
        members: state.members,

        clearTeam,
        setTeamDetails,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export default TeamState;
