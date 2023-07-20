import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (
        <div className="homePageWrapper" style={{ 
            backgroundImage: `url("https://images.wallpaperscraft.com/image/single/buildings_architecture_bottom_view_217197_1600x900.jpg")`,

            backgroundSize: 'cover'
          }}>
            <div className="formWrapper">
                <img
                    className="homePageLogo"
                    src="/CodeUnite.png"
                    alt="IDE"
                    style={{height:'150px'}}
                />
                {/* <h3>CodeUnite</h3> */}
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <h4 className="mainLabel">or</h4>

                    <span className="createInfo">
                       
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="createNewBtn"
                        >
                            Create New Room
                        </a>
                    </span>
                </div>
            </div>
          
        </div>
    );
};

export default Home;
