import React, { useState } from 'react';
import ChatItem from '../shared/chatItem';

const ChatList = ({ w = "100%",
 chats = [],
  chatId,
  onlineUsers = [],
   newMessagesAlert =
   [
    {
    chatId:"",
    count:0,
   },
  ] ,
    handleDeleteChat }) => {

  return (
    <div style={{ width: w }}>
    {chats?.map((data, index) => {
      const { avatar, _id, name, groupchat, members } = data;

      const newMessageAlert = newMessagesAlert.find(
        ({ chatId }) => chatId === _id
      );

      const isOnline = members?.some((member) =>
        onlineUsers.includes(member)
      );

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
    </div>
  )
}

export default ChatList
