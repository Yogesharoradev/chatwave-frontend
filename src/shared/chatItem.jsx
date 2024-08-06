import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Typography, Popover, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '../redux/reducers/misc';
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../redux/api/api';
import {motion} from "framer-motion" 

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupchat= false,
  isOnline,
  newMessageAlert,
  handleDeleteChat,
  isSelected,
  onSelectChat
}) => {
  const dispatch = useDispatch();
  const {selectedDeleteChat} = useSelector((state) => state.misc)
  const [ popoverVisible ,  setPopoverVisible] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const [deleteChat] = useDeleteChatMutation()
  const [leaveGroup] =useLeaveGroupMutation()

  const displayedAvatars = avatar?.map((avatars, index) => (
    <Avatar key={index} src={avatars} />
  ));

  const closeDrawer = () => {
    dispatch(setIsMobile(false));
  };

  const handleContextMenu = (e , _id , groupChat) => {
    e.preventDefault();
    setPopoverPosition({ x: e.clientX, y: e.clientY });
    setPopoverVisible(true);
    handleDeleteChat(e , _id , groupchat)
  };


  const handleLeaveGroup =async () => {
    try{  
      await leaveGroup({chatId : _id}).unwrap()
      message.success("leave Group successfuly")
    }catch(err){
      message.error(err)
    }finally{
      setPopoverVisible(false);
    }
  };

  const handleLeaveChat = async() => {
    try{  
      await deleteChat({chatId : _id}).unwrap()
      message.success("Chat Deleted")
    }catch(err){
      message.error(err)
    }finally{
      setPopoverVisible(false);
    }
  };

  const popoverContent = (
    <div>
      {
        groupchat ?  <Button type="link" icon={<DeleteOutlined/>}  onClick={handleLeaveGroup}>
        Leave Group
      </Button> :  <Button type="link"  icon={<DeleteOutlined/>}  onClick={handleLeaveChat}>
        Remove Friend
      </Button>
      }
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      <Popover
        content={popoverContent}
        trigger="click"
        placement="bottomLeft"
        open={popoverVisible}
        onOpenChange={(visible) => setPopoverVisible(visible)}
        overlayStyle={{ position: 'fixed', left: popoverPosition.x, top: popoverPosition.y }}
      ></Popover>
        <div
          className='flex hover:bg-slate-300 gap-3 items-center py-3 px-5 m-1 rounded relative'
          style={{
            backgroundColor: isSelected ? '#e0f7fa' : '',
          }}
        >
          <Link
            className='w-full'
            to={`/chat/${_id}`}
            onClick={closeDrawer}
            onContextMenu={handleContextMenu}
          >
            <div className='flex gap-7 items-center' >
              {groupchat ? (
                <Avatar.Group max={3} size="large">
                  {displayedAvatars}
                </Avatar.Group>
              ) : (
                <Avatar size="large" src={avatar[0]} />
              )}
              <div>
                <Typography className='text-black font-semibold text-xl'>
                  {name}
                </Typography>
                {newMessageAlert && (
                  <Typography>
                    <b>{newMessageAlert}</b> New Message
                  </Typography>
                )}
                {isOnline && (
                  <div className="relative">
                    <Avatar size="large" src={avatar[0]} />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
    </div>
  );
};

export default memo(ChatItem);
