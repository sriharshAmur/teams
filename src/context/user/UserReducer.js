import { LOAD_USER, LOAD_NEW_USER, CLEAR_USER, LOAD_TOKEN } from '../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case LOAD_NEW_USER:
        case LOAD_USER:
            return {
                ...state,
                ...action.payload,
            };
        case CLEAR_USER:
            return {
                ...state,
                uid: '',
                name: '',
                inVideoCall: false,
                email: '',
                teams: [],
                chats: [],
                channels: [],
                joinID: null,
                members: [],
                token: '',
            };
        case LOAD_TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        default: {
            return state;
        }
    }
};
