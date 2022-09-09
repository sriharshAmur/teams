import { CLEAR_TEAM, LOAD_TEAM_DETAILS } from "../types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
    case CLEAR_TEAM:
      return {
        ...state,
        name: "",
        description: "",
        createdAt: "",
        createdBy: "",
        channels: [],
        joinID: null,
        members: [],
        owner: false,
      };
    case LOAD_TEAM_DETAILS:
      return {
        ...state,
        name: action.payload.name,
        description: action.payload.description,
        createdAt: action.payload.createdAt,
        createdBy: action.payload.createdBy,
        channels: [...action.payload.channels],
        joinID: action.payload.joinID,
        members: [...action.payload.members],
        owner: action.payload.owner,
      };
    default: {
      return state;
    }
  }
};
