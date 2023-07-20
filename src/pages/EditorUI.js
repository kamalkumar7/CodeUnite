import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions.js';
import Client from '../components/Client.js';
import Editor from '../components/Editor.js';
import Toggle from './Toggle.js';

import { initSocket } from '../socket.js';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

import leaveimg from '../img/leave.png'
import copyimg from '../img/copy.png'

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);

    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [mode,setmode] = useState('light')

    const  [theme,settheme] = useState('dracula');

    const changeTheme = ()=>{
        
        if(theme=='eclipse')
        {
            settheme('dracula')
            setmode('light');
        }
        else{
            settheme('eclipse')
            setmode('dark');
        }
        console.log(theme);
    }

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID Copied');
        } catch (err) {
            toast.error('Error while copying the room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }


    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInnerBox">
                    <div className="logo">
                        <img
                            className="logoImage"
                            src="/codeUnite.png"
                            alt="logo"
                            style={{height:'125px'}}
                        />
                       
                    </div>

                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

                
                {/* <button style={{textAlign:'center' , alignItems:'center', display:'flex', background:'none' ,marginBottom:'5px'
                }} title= {`Switch to ${mode} `} className='btn' onClick={changeTheme}>
                <img src= {darkimg} style={{height:'25px' ,  margin:'auto'}}/> 

                </button> */}
                <Toggle changeTheme={changeTheme}/>
                  
                <button className="btn copyBtn" onClick={copyRoomId} style={{alignItems:'center' ,zIndex:'4'}}>
                    <img src= {copyimg} style={{height:'18px'}}/>
                    &nbsp; Copy ROOM-ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>LEAVE ROOM &nbsp;

                <img src={leaveimg} style={{height:"15px"}}  />    </button>
            </div>
            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                    theme ={theme}
                    settheme = {settheme}

                />
            </div>
        </div>
    );
};

export default EditorPage;
