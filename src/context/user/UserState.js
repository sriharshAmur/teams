import React, { useReducer } from 'react';
import UserReducer from './UserReducer';
import UserContext from './UserContext';

import { LOAD_USER, LOAD_NEW_USER, CLEAR_USER, LOAD_TOKEN } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const UserState = ({ children }) => {
    const initialState = {
        uid: '',
        name: '',
        inVideoCall: false,
        email: '',
        teams: [],
        chats: [],
        token: '',
    };

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const loadNewUser = (user) => {
        dispatch({ type: LOAD_NEW_USER, payload: user });
    };

    const loadToken = (token) => {
        dispatch({ type: LOAD_TOKEN, payload: token });
    };

    const clearUser = () => {
        dispatch({ type: CLEAR_USER });
    };

    const loadUserDetails = async (user) => {
        const userRef = doc(db, 'test-user', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            let teamArr = [];
            let chatArr = [];
            for (const teamId in data.teams) {
                let obj = {
                    id: teamId,
                    name: data.teams[teamId],
                };
                teamArr.push(obj);
            }
            for (const chatId in data.chats) {
                let obj = {
                    id: chatId,
                    name: data.chats[chatId],
                };
                chatArr.push(obj);
            }

            const userObj = {
                uid: user.uid,
                name: data.name,
                email: user.email,
                teams: teamArr,
                chats: chatArr,
            };
            dispatch({ type: LOAD_USER, payload: userObj });
        } else {
        }
    };

    // const getTeamName = (teamId) => {
    //   if (state.teams.length > 0) {
    //     return state.teams.find((team) => team.id === teamId).name;
    //   }
    //   return null;
    // };

    return (
        <UserContext.Provider
            value={{
                uid: state.uid,
                name: state.name,
                inVideoCall: state.inVideoCall,
                email: state.email,
                teams: state.teams,
                chats: state.chats,

                loadNewUser,
                clearUser,
                loadUserDetails,
                loadToken,
                // getTeamName,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserState;
