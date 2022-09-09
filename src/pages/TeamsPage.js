import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Channel from '../components/Teams/Channel';
import Channels from '../components/Teams/Channels';
import CreateTeam from '../components/Teams/new/CreateTeam';
import NewChannel from '../components/Teams/new/NewChannel';
import NewTeam from '../components/Teams/new/NewTeam';
import Settings from '../components/Teams/Settings/Settings';
import Teams from '../components/Teams/Teams';
import ChannelVideo from '../components/video/ChannelVideo';
import { auth } from '../firebase';

const TeamsPage = () => {
    return (
        <div className='h-full'>
            <Routes>
                <Route path='/' element={<Teams />} />
                <Route path='/new' element={<NewTeam />} />
                <Route path='/new/create' element={<CreateTeam />} />
                <Route path=':teamId/*' element={<ChannelsPage />} />
            </Routes>
        </div>
    );
};

const ChannelsPage = () => {
    return (
        <div className=' flex h-full'>
            <Channels />
            <Routes>
                <Route path='/settings' element={<Settings />} />
                <Route path='/channels/new' element={<NewChannel />} />
                <Route path='/channels/:channelId' element={<Channel />} />
                <Route
                    path='/channels/:channelId/video'
                    element={<ChannelVideo />}
                />
            </Routes>
        </div>
    );
};

export default TeamsPage;
