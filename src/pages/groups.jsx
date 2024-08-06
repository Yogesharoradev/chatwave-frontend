import { Avatar, Button, Drawer, FloatButton, Form, Input, Modal, Skeleton, Tooltip, Typography, message } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { CiMenuBurger } from 'react-icons/ci';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { MdBackspace, MdDoneOutline, MdModeEdit } from 'react-icons/md';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAddMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useMyFriendsQuery, useMyGroupsQuery, useRemoveMemberMutation, useRenameGroupMutation } from '../redux/api/api';

const Groups = () => {
  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");

  const { data: myGroupsData } = useMyGroupsQuery("");
  const { data: groupDetailsData, refetch: refetchGroupDetails } = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });
  const { data: friendsData, isLoading: isFriendsLoading } = useMyFriendsQuery(chatId);
  
  const [updateGroup] = useRenameGroupMutation();
  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [deleteGroup] = useDeleteChatMutation();
  
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  
  const [members, setMembers] = useState([]);
  const [selectMembers, setSelectMembers] = useState([]);

  
  useEffect(() => {
    if (groupDetailsData) {
      console.log(groupDetailsData)
      setGroupNameUpdated(groupDetailsData.chat?.name);
      setGroupName(groupDetailsData.chat?.name);
      setMembers(groupDetailsData.chat?.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetailsData]);


  const onChangeInput =(e)=>{
     setGroupNameUpdated(e.target.value)
  }
  const handleGroupNameUpdate = async () => {
    try {
      setIsEdit(false);
      await updateGroup({ name: groupNameUpdated, chatId }).unwrap();
      refetchGroupDetails();
      message.success("Updated group name successfully");
    } catch (err) {
      message.error("Cannot change group name, error");
    }
  };

  const handleAddMember = async () => {
    const selectedFriends = friendsData.friends.filter(friend => selectMembers.includes(friend._id));
    try {
      await addMember({ chatId, members: selectedFriends }).unwrap();
      refetchGroupDetails();
      console.log(refetchGroupDetails)
      message.success("Members added successfully");
      setIsAddMemberModalOpen(false);
    } catch (error) {
      message.error(error?.data?.message);
    }
  };

  const removeMemberHandler = async (userId) => {
    try {
      await removeMember({ chatId, userId }).unwrap();
      refetchGroupDetails();
      message.success("Member removed successfully");
    } catch (err) {
      message.error(err?.data?.message);
    }
  };

  const deleteGroupHandler = async () => {
    try {
      await deleteGroup({ chatId }).unwrap();
      setIsDeleteModalOpen(false);
      message.success("Group deleted");
      navigate("/groups");
    } catch (err) {
      message.error("Unable to delete group");
    }
  };

  const GroupNameComponent = () => (
    <div className='h-full w-full'>
      {isEdit ? (
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full mt-4">
          
          <input 
            value={groupNameUpdated} 
            type='text'
            size="large" 
            onChange={onChangeInput} 
            className="rounded-xxl px-4 py-2 border w-full md:w-auto"
            placeholder="Enter group name"
          />
          <Button 
            className="flex justify-center items-center mt-4 md:mt-0 w-10 h-10 rounded-full bg-purple-700 text-white hover:bg-purple-300 transition-all duration-300"
            onClick={handleGroupNameUpdate}
            icon={<MdDoneOutline />}
          />
        </div>
      ) : (
        <div className='text-center flex justify-center items-center gap-5'>
          <h1 className='text-3xl font-semibold border border-b-4 px-6 py-2'>{groupName}</h1>
          <Tooltip title="Edit group name">
            <button className="mt-2" onClick={() => setIsEdit(true)}>
              <MdModeEdit className='text-2xl' />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 min-h-screen'>
      <div className='hidden md:block bg-purple-200 h-full w-[350px]'>
        <h1 className='text-center font-semibold my-5 text-3xl'>All Groups</h1>
        <GroupList GroupsList={myGroupsData?.groups} chatId={chatId} />
      </div>
      <div className='col-span-2 h-full my-3 mx-3'>
        <div className='flex items-center gap-12 md:gap-48 mb-4'>
          <Tooltip title="Back to Chats">
            <FloatButton icon={<MdBackspace className="text-xl" />} onClick={() => navigate("/")} shape='square' />
          </Tooltip>
          {chatId && (
            <div className='flex justify-center items-center gap- h-auto w-full'>
              <div className='p-4'>
                <GroupNameComponent />
              </div>
            </div>
          )}
        </div>
        <div className='md:hidden fixed right-1 top-1 p-5'>
          <button className="p-4" size="large" onClick={() => setOpen(true)}>
            <CiMenuBurger className="text-3xl" />
          </button>
          <Drawer width={"300px"} open={open} onClose={() => setOpen(false)}>
            <GroupList GroupsList={myGroupsData?.groups} chatId={chatId} />
          </Drawer>
        </div>
        {chatId ? (
          <>
            <div className="flex flex-col items-center">
              <Typography className='text-4xl mb-4'>Members</Typography>
              <div className="h-96 w-96 mx-auto box-border overflow-auto">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-5 border-b-4">
                    <div className="flex items-center gap-2">
                      <Avatar src={member.avatar} />
                      <Typography>{member.name}</Typography>
                    </div>
                    <Tooltip title="Remove">
                      <button onClick={() => removeMemberHandler(member._id)}>
                        <FaMinusCircle className='h-6 w-6 text-red-500' />
                      </button>
                    </Tooltip>
                  </div>
                ))}
              </div>
              <div className='flex md:flex-row flex-col gap-4 mx-auto'>
                <Button type="primary" className='bg-blue-600 text-white' onClick={() => setIsAddMemberModalOpen(true)}>Add Member</Button>
                <Button type="danger" className='bg-red-600 text-white' onClick={() => setIsDeleteModalOpen(true)}>Delete Group</Button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center h-full'>
            <h1 className='font-semibold text-5xl text-center'>Manage Your Groups</h1>
          </div>
        )}
      </div>
      <Modal
        title="Delete Group"
        open={isDeleteModalOpen}
        onOk={deleteGroupHandler}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this group?</p>
      </Modal>
      <Modal
        title="Add Member"
        open={isAddMemberModalOpen}
        onOk={handleAddMember}
        onCancel={() => setIsAddMemberModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsAddMemberModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleAddMember}>Submit Changes</Button>
        ]}
      >
        <div className="flex flex-col m-2 p-3 gap-4">
          {isFriendsLoading ? (
            <Skeleton />
          ) : (
            friendsData?.friends.length > 0 ? (
              friendsData.friends.map((friend, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-2">
                    <Avatar src={friend.avatar} />
                    <Typography>{friend.name}</Typography>
                  </div>
                  {selectMembers.includes(friend._id) ? (
                    <Tooltip title="Remove">
                      <button className='mb-4' onClick={() => setSelectMembers(prev => prev.filter(id => id !== friend._id))}>
                        <FaMinusCircle className='h-6 w-6 text-red-500' />
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Add">
                      <button className='mb-4' onClick={() => setSelectMembers(prev => [...prev, friend._id])}>
                        <FaPlusCircle className='h-6 w-6 text-blue-500' />
                      </button>
                    </Tooltip>
                  )}
                </div>
              ))
            ) : (
              <Typography>No Friends</Typography>
            )
          )}
        </div>
      </Modal>
    </div>
  );
};

const GroupList = ({ GroupsList = [], chatId }) => (
  <div className='flex flex-col gap-4'>
    {GroupsList.length > 0 ? (
      GroupsList.map(group => <GroupListItem key={group._id} group={group} chatId={chatId} />)
    ) : (
      <h1 className='text-center font-semibold text-2xl'>No groups</h1>
    )}
  </div>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link to={`?group=${_id}`} onClick={e => chatId === _id && e.preventDefault()}>
      <div className='flex items-center gap-4 p-2 hover:bg-gray-200'>
        <Avatar.Group max={3} size="large">
          {avatar.map((url, index) => <Avatar key={index} src={url} />)}
        </Avatar.Group>
        <h1 className='font-semibold text-2xl'>{name}</h1>
      </div>
    </Link>
  );
});

export default Groups;
