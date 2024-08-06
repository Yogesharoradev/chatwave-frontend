import React, { useCallback, useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom"
import Header from './header';
import Title from '../shared/title';
import ChatList from '../specific/chatList';
import Profile from '../specific/profile';
import { useMyChatsQuery } from '../redux/api/api';
import { Drawer, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../redux/reducers/misc';
import {useErrors, useSocketEvents} from "../hooks/hooks"
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../constants/events';
import { incrementNotificationCount, setNewMessageAlert } from '../redux/reducers/chat';
import { getSocket } from '../socket';
import { getorSaveFromStorage } from '../lib/features';


 
const AppLayout = ()=>(WrappedComponent) =>{
    return  (props) => {

        const params = useParams()
        const chatId  = params.chatId
        const socket = getSocket()
        const navigate = useNavigate()

        const [onlineUsers , setOnlineUsers] =useState([])

        const dispatch = useDispatch();
        const { isMobile } = useSelector((state) => state.misc);
        const  { user } = useSelector((state) => state.auth);


        const { isLoading, isError, error, data, refetch } = useMyChatsQuery();
        useErrors([{isError , error}])

        const handleMobile = ()=>{
            dispatch(setIsMobile(false))
        }
        const  { NewMessageAlert } = useSelector((state) => state.chat);

        useEffect(()=>{
            getorSaveFromStorage({key : NEW_MESSAGE_ALERT , value :NewMessageAlert})
        },[NewMessageAlert])
        
        const newMessageAlertHandler = useCallback((data) => {
            if(data.chatId === chatId) return
                dispatch(setNewMessageAlert(data));
        }, [dispatch ,chatId]);
        
        const RefetchListener = useCallback(()=>{
                refetch()
                navigate("/")
        },[refetch , navigate])


        const newRequest = useCallback(()=>{
            dispatch(incrementNotificationCount())
        },[dispatch])

        const handleDeleteChat =(e , chatId, groupChat)=>{
            e.preventDefault()
            dispatch(setIsDeleteMenu(true))
            dispatch(setSelectedDeleteChat(chatId , groupChat))
        }
        const onlineUsersListener =useCallback((data)=>{
                setOnlineUsers(data)
        })

        const eventHandlers = {
            [NEW_MESSAGE_ALERT] : newMessageAlertHandler ,
            [NEW_REQUEST] : newRequest,
            [REFETCH_CHATS] : RefetchListener ,
            [ONLINE_USERS]: onlineUsersListener
        }

        useSocketEvents(socket , eventHandlers)
        
        return (
            <>
            <Title />
            <Header />
            {
                isLoading ? (
                    <Skeleton />
                    ) : (
                        <Drawer width={400} open={isMobile} onClose={handleMobile} title={<h1 className='font-semibold text-3xl text-center'>Friends</h1>}>
                        <ChatList chats={data?.chats} w="70vw"
                        onlineUsers={onlineUsers} chatId={chatId} newMessagesAlert={NewMessageAlert} handleDeleteChat={handleDeleteChat}/>
                        </Drawer>
                        )
                    }
                    <div className='grid grid-cols-6' style={{ height: 'calc(100vh - 4rem)', overflow: "hidden" }}>
                    <aside className='hidden md:block col-span-1 h-full overflow-auto w-auto'>
                    {isLoading ? (<Skeleton />) : (<ChatList chats={data?.chats} 
                         onlineUsers={onlineUsers}
                    w="auto" chatId={chatId}  newMessagesAlert={NewMessageAlert} handleDeleteChat={handleDeleteChat}/>)}
                    </aside>
                    
                    <main className='h-full col-span-6 md:col-span-4 overflow-hidden'>
                    <WrappedComponent {...props} chatId={chatId} user={user} />
                    </main>
                    
                    <div className='hidden md:block col-span-1 h-full overflow-auto'>
                    <Profile user={user} />
                    </div>
                    </div>
                    </>
                    );
                }
                };
                
export default AppLayout;
