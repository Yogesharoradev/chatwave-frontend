import { DeleteOutlined } from '@ant-design/icons';
import { Avatar, Button, Popover, Typography, message } from 'antd';
import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../redux/api/api';
import { setIsMobile } from '../redux/reducers/misc';

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
  const {selectedDeleteChat} = useSelector((state) => state.misc);
  

  const [ popoverVisible ,  setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const [deleteChat] = useDeleteChatMutation();
  const [leaveGroup] = useLeaveGroupMutation();

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
    handleDeleteChat(e , _id , groupchat);
  };

  const handleLeaveGroup = async () => {
    try{  
      await leaveGroup({ chatId: _id }).unwrap();
      message.success("Left Group successfully");
    } catch(err) {
      message.error(err);
    } finally {
      setPopoverVisible(false);
    }
  };

  const handleLeaveChat = async () => {
    try {  
      await deleteChat({ chatId: _id }).unwrap();
      message.success("Chat Deleted");
    } catch(err) {
      message.error(err);
    } finally {
      setPopoverVisible(false);
    }
  };

  const popoverContent = (
    <div>
      {groupchat ? 
        <Button type="link" icon={<DeleteOutlined />} onClick={handleLeaveGroup}>
          Leave Group
        </Button> :  
        <Button type="link" icon={<DeleteOutlined />} onClick={handleLeaveChat}>
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
      />
      <div
        className={`flex hover:bg-slate-300 gap-3 items-center py-2 px-4 m-1 rounded relative ${isSelected ? 'bg-cyan-100' : ''}`}
        onContextMenu={(e) => handleContextMenu(e, _id, groupchat)}
      >
        <Link
          className="flex gap-4 items-center w-full overflow-hidden"
          to={`/chat/${_id}`}
          onClick={closeDrawer}
        >
          {groupchat ? (
            <Avatar.Group max={2} size="large">
              {displayedAvatars}
            </Avatar.Group>
          ) : (
            <Avatar size="large" src={avatar[0]} />
          )}
          <div className="flex-1 min-w-0">
            <Typography className="text-black font-semibold truncate">
              {name}
            </Typography>
            {newMessageAlert?.count > 0 && (
              <Typography className="text-sm text-red-500">
                {newMessageAlert.count} New Message{newMessageAlert.count > 1 ? 's' : ''}
              </Typography>
            )}
            {isOnline && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white mr-2"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default memo(ChatItem);
