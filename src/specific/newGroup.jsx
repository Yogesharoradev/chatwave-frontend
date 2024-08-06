import { useInputValidation } from '6pp';
import { Avatar, Button, Form, Input, Modal, Skeleton, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import { FaMinus, FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useMyFriendsQuery ,useMyGroupsMutation } from '../redux/api/api';
import { setIsNewGroup } from '../redux/reducers/misc';

const NewGroup = () => {
  const dispatch = useDispatch()
  const {isNewGroup} = useSelector((state)=>state.misc)
  const {isError , isLoading , error , data} = useMyFriendsQuery()
  const [ NewGroupdata] = useMyGroupsMutation()

    const [selectMembers , setSelectMembers] = useState([])

    const cancel =()=>{
          dispatch(setIsNewGroup(false))
    }

    const selectmemberhandler =(id)=>{
            setSelectMembers((prev)=>
            prev.includes(id) 
            ? prev.filter((current) => current !== id ) :
            [...prev , id]    
            )
    }

    const SubmitHandler = (values) => {
      if (!values.GroupName) return message.error("Group name is required");
      if (selectMembers.length < 2) return message.error("Please select at least 2 members");
      
      const selectedFriends = data?.friends.filter(friend => selectMembers.includes(friend._id));
      
      // Creating group
      NewGroupdata({ name: values.GroupName, members: selectedFriends })
        .then(() => {
          message.success("Group created successfully!");
          cancel();
        })
        .catch((error) => {
          message.error("Failed to create group");
          console.error(error);
        });
    }

    const getSelectedMemberNames = () => {
      const selectedFriends = data?.friends.filter(friend => selectMembers.includes(friend._id));
      return selectedFriends ? selectedFriends.map(friend => friend.name).join(', ') : '';
    };
  
  return (
    <div>
      <Modal open={isNewGroup} title={"New Group"} onCancel={cancel} footer={null} className=''>


      <Form onFinish={SubmitHandler}>
      <Form.Item name="GroupName" rules={[{ required: true, message: 'Please input the group name!' }]}>
        <Input  
        className='p-2 m-3'
        name='GroupName'
        placeholder='Group Name'
        />
        </Form.Item>
        
        <div className='p-2 m-1 flex gap-3'>
            <h2 className='text-lg font-semibold'>Selected Members:</h2>
            <p className='text-lg font-semibold'>{getSelectedMemberNames() || 'No members selected'}</p>
          </div>


        <h1 className='p-2 m-1'>Members</h1>
        {
          isLoading ? <Skeleton/> :  data?.friends?.map((i)=>(
                <div key={i._id} className='flex gap-2 justify-between items-center space-y-9  mt-3 hover:bg-gray-300 rounded-lg'>
                    <div className='flex items-center gap-2 ml-4' >
                         <Avatar size="large" src={i.avatar}></Avatar>
                        <h1>{i.name}</h1>
                    </div>
                    <div className='flex items-center mr-5'>
                    
                    {selectMembers.includes(i._id) ? (
                  <Tooltip title="Remove">
                    <button className='mb-4' type="button" onClick={() => selectmemberhandler(i._id)}>
                      <FaMinusCircle className='h-6 w-6 text-red-500' />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Add">
                    <button className='mb-4' type="button"  onClick={() => selectmemberhandler(i._id)}>
                      <FaPlusCircle className='h-6 w-6 text-blue-500' />
                    </button>
                  </Tooltip>
                )}
                    </div>
                   
                </div>
            ))
          }
        <div className='p-4 m-2 flex items-center gap-5'>
        <Button className='bg-blue-600 text-white' htmlType='submit' >Create</Button>
        <Button type='danger' className='bg-red-600  text-white' onClick={cancel}>Cancel</Button>
        </div>
       </Form>
      </Modal>
    </div>
  )
}

export default NewGroup

