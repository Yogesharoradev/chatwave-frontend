import { Avatar, Input, Modal, Tooltip, message } from 'antd'
import React, { useEffect, useState } from 'react'
import {useInputValidation} from '6pp'
import { MdSearch } from 'react-icons/md';
import { FaPlusCircle, FaPlusSquare } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../redux/api/api';

const Search = () => {
      
  const {isSearch} = useSelector((state)=> state.misc)
  const dispatch = useDispatch()

    const search = useInputValidation("")
    const [users ,setUsers] = useState ([])

    const [searchUser] = useLazySearchUserQuery()
    const [ sendFriendRequest ] = useSendFriendRequestMutation()

    useEffect(()=>{
      const timeOut = setTimeout(()=>{
         searchUser(search.value)
         .then(({data})=>setUsers(data.users))
         .catch((err)=>message.error(err))
      },1000)
      return ()=>{
        clearTimeout(timeOut)
      }
    },[search.value])

    const FriendRequestHandler = async (id)=>{
      try {
      const res =  await sendFriendRequest({userId : id})
      if(res.data){
          message.success("Friend Request Sent")
      }else{
        message.error(res?.error?.data)
      }
      } catch (error) {
          message.error("something went wrong")
      }
        
    }

    const closeSearch =()=>{
      dispatch(setIsSearch(false))
    }
   
  return (
    <div>
      <Modal open={isSearch} title={"Find People"} onCancel={closeSearch} footer={null}>
        <div className='flex gap-3 items-center'>
           
        <Input
         placeholder='search'
                value={search.value}
                onChange={search.changeHandler}
                prefix={ <MdSearch className=' h-4 w-4' />}
        />
        </div>
      <div>
        {
          users &&
          users.map((user , index)=>(
            <div  key={index} className='flex gap-2 cursor-pointer justify-between items-center space-y-9  mt-3 hover:bg-gray-300 rounded-lg'>
                    <div className='flex items-center gap-2 ml-4' >
                         <Avatar size="large" src={user.avatar}></Avatar>
                        <h1>{user.name}</h1>
                    </div>
                   
                    <div className='flex items-center mr-5'>
                        <Tooltip title="ADD">
                        <button className='mb-5 bg-blue-500 rounded-full' onClick={()=>FriendRequestHandler(user._id)} >
                            <FaPlusCircle className='h-6 w-6 text-white '/>
                        </button>
                        </Tooltip>
                        
                    </div>
                   
                </div>
            ))
          }
          </div>
      </Modal>
    </div>
  )
}

export default Search
