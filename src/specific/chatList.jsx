import React, { useEffect } from 'react';
import { useMyGroupsQuery } from '../redux/api/api';
import ChatItem from '../shared/chatItem';

const ChatList = ({ w = "100%", chats = [], chatId, onlineUsers = [], newMessagesAlert = [], handleDeleteChat }) => {
  const {  refetch: refetchMyGroups } = useMyGroupsQuery("");
  const friends = chats.filter(chat => !chat.groupchat);
  const groups = chats.filter(chat => chat.groupchat);

  useEffect(()=>{
    refetchMyGroups()
  },[])
  return (
    <div style={{ width: w }}>
    
      {friends.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-3 text-center p-2 text-black">Friends</h2>
          {friends.map((data, index) => {
            const { avatar, _id, name, groupchat, members } = data;
            const newMessageAlert = newMessagesAlert.find(({ chatId }) => chatId === _id);
            const isOnline = members?.some(member => onlineUsers.includes(member));

            return (
              <ChatItem
                index={index}
                newMessageAlert={newMessageAlert}
                isOnline={isOnline}
                avatar={avatar}
                name={name}
                _id={_id}
                key={_id}
                groupchat={groupchat}
                sameSender={chatId === _id}
                handleDeleteChat={handleDeleteChat}
              />
            );
          })}
        </>
      )}

      {groups.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-3 text-center p-2 text-black">Groups</h2>
          {groups.map((data, index) => {
            const { avatar, _id, name, groupchat, members } = data;
            const newMessageAlert = newMessagesAlert.find(({ chatId }) => chatId === _id);
            const isOnline = members?.some(member => onlineUsers.includes(member));

            return (
              <ChatItem
                index={index}
                newMessageAlert={newMessageAlert}
                isOnline={isOnline}
                avatar={avatar}
                name={name}
                _id={_id}
                key={_id}
                groupchat={groupchat}
                sameSender={chatId === _id}
                handleDeleteChat={handleDeleteChat}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default ChatList;
