import { CLEAR_TEAM, LOAD_TEAM_DETAILS } from "../types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
    case CLEAR_TEAM:
      return [];
    case LOAD_TEAM_DETAILS:
      return action.payload;
    default: {
      return state;
    }
  }
};
