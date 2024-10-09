
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal, Skeleton, Tooltip, message } from 'antd';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useErrors } from "../hooks/hooks";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../redux/api/api';
import { setIsNotification } from "../redux/reducers/misc";

const Notifications = () => {

    const {isLoading , error , isError , data } = useGetNotificationsQuery()
    const {isNotification} = useSelector((state) => state.misc)
    const dispatch = useDispatch()
    const [acceptRequest] =useAcceptFriendRequestMutation()

    const closeNotifications = () => {
        dispatch(setIsNotification(false))
    }

    const friendrequestHandler=async({_id , accept})=>{
       try {
         const res = await acceptRequest({requestId : _id , accept}).unwrap()
         message.success(res?.message)
       } catch (error) {    
        message.error(res?.error || "something went wrong")
       }
       finally{
        dispatch(setIsNotification(false))
       }
    }
       useErrors([{error ,isError}])


  return (
    <>
        <div>
      <Modal open={isNotification} title={"Notifications"} onCancel={closeNotifications} footer={null}>
     {
        isLoading ? <Skeleton/> : 
        <div className='flex gap-3 items-center justify-between flex-col'>
        {
           data.allRequests?.length > 0 ?
            (
           data?.allRequests?.map(({sender , _id}) => (
                <NotificationItem 
                sender={sender}
                _id = {_id}
                handler={friendrequestHandler}
                key={_id}
                />)
                ) 

                ) :
             (
                <h1 className='text-center font-semibold text-2xl'> No Notifications</h1>
            )
        }
    </div>
     }
      </Modal>
    </div>
    </>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {
    return (
      <div className='flex flex-col sm:flex-row w-full items-start sm:items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-300'>
        <div className='flex items-center gap-2 justify-center'>
            <div>

        <Avatar 
          size={64} 
          src={sender?.avatar.url} 
          alt={sender?.name} 
          className=' md:w-24 md:h-24'
          />
          </div>
  
        <div className='flex-grow'>
          <h1 className='text-base sm:text-lg font-semibold'>
            {sender?.name} sends you a friend request
          </h1>
        </div>
  
          </div>
        {/* Actions */}
        <div className='flex  sm:flex-row items-center justify-between mt-2 sm:ml-4 space-x-2 sm:space-y-0 sm:space-x-2'>
          <Tooltip title="Accept">
            <Button 
              icon={<CheckOutlined />} 
              onClick={() => handler({ _id, accept: true })} 
              type='primary' 
              className='w-full sm:w-auto'
            >
              Accept
            </Button>
          </Tooltip>
          <Tooltip title="Reject">
            <Button 
              icon={<CloseOutlined />} 
              onClick={() => handler({ _id, accept: false })} 
              type='default' 
              danger 
              className='w-full sm:w-auto'
            >
              Reject
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  });
  



export default Notifications