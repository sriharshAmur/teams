import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const ChannelVideo = () => {
    const [meetingID, setMeetingID] = useState(null);
    let navigate = useNavigate();

    const joinMeeting = () => {
        console.log('joingin meeting ', meetingID);
    };

    return (
        <div className=' w-full h-full p-4 overflow-hidden  bg-gray-100'>
            <div className='flex items-center cursor-pointer  hover:bg-gray-100 w-fit rounded'>
                <IoIosArrowBack size={15} />
                <Link to={'/teams'}>
                    <div className='ml-2' onClick={() => navigate(-1)}>
                        Back
                    </div>
                </Link>
            </div>
            <div className='text-2xl  my-4 '>Join or Create a Meeting</div>
            <div className='flex '>
                <div className=' mr-8 w-96 flex flex-col items-center justify-center border-2 rounded  '>
                    <div>Create a Meeting</div>
                    <Link to='create'>
                        <button className='border-2 py-2 px-4 mt-4 hover:bg-blue-700 hover:text-white'>
                            Create a Meeting
                        </button>
                    </Link>
                </div>
                <form
                    onSubmit={joinMeeting}
                    className=' w-96 flex flex-col  items-center p-20 border-2  rounded '
                >
                    Join a Meeting
                    <input
                        className='border-2 px-2 py-1 my-4'
                        placeholder='Enter Team Code'
                        type={'number'}
                        value={meetingID}
                        onChange={(e) => setMeetingID(parseInt(e.target.value))}
                        onEmptied={() => setMeetingID('')}
                    />
                    <button
                        type='submit'
                        className='border-2 py-2 px-4  cursor-pointer hover:bg-blue-700 hover:text-white'
                    >
                        Join Meeting
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChannelVideo;
