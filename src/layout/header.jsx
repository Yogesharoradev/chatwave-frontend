import { Backdrop } from '@mui/material';
import { Badge, Button, Tooltip, message } from 'antd';
import React, { Suspense, lazy, useState } from 'react';
import { CiMenuBurger, CiSearch } from 'react-icons/ci';
import { IoLogOutOutline, IoNotificationsSharp } from 'react-icons/io5';
import { MdGroups2, MdOutlineGroupAdd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userNotExists } from '../redux/reducers/auth';
import axios from "axios"
import { server } from '../constants/config';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../redux/reducers/misc';
import { resetNotficationCount } from '../redux/reducers/chat';

const Header = () => {

  const Search = lazy(() => import('../specific/search'));
  const Notification = lazy(()=>import('../specific/notifications'))
  const Group = lazy(()=>import("../specific/newGroup"))

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {isSearch , isNotification , isNewGroup} = useSelector((state)=>state.misc)
  const {NotificationCount} = useSelector((state)=>state.chat)

 

  const navigateGroup = () => {
    navigate('/groups');
  };

  const handleSearch = () => {
   dispatch(setIsSearch(true));
  };

  const handleNotification =()=>{
    dispatch(setIsNotification(true))
    dispatch(resetNotficationCount())
  }

  const handleGroup =()=>{
    dispatch(setIsNewGroup(true))
  }

  const handleLogout= async ()=>{ 
   try {
    const {data} = await axios.get(`${server}/api/v1/user/logout` , { withCredentials : true})
    dispatch(userNotExists())
    message.success(data.message)
   } catch (err) {
    console.log(err)
    const errorMessage = err.response?.data  || "Something went wrong";
    message.error(errorMessage);
   }
  }

  const handleDrawer= ()=>{
    dispatch(setIsMobile(true))
  }
  return (
    <>
      <div className="h-[4rem] flex justify-between items-center w-full bg-orange-400">
        <div>
          <button className="p-2 rounded-lg ml-4 font-bold text-3xl text-white md:block hidden hover:text-blue-500" onClick={()=>navigate("/")}>ChatWave</button>
          <button className="p-4 md:hidden" size="large" onClick={handleDrawer}>
            <CiMenuBurger className="text-4xl text-white" />
          </button>
        </div>

        <div className="flex gap-5 p-5 mr-4 md:mr-12">
          <Tooltip title="search">
            <button onClick={handleSearch}>
              <CiSearch className="text-4xl text-white font-bold" />
            </button>
          </Tooltip>
          <Tooltip title="New Group">
            <button onClick={handleGroup}>
              <MdOutlineGroupAdd className="text-4xl text-white font-bold" />
            </button>
          </Tooltip>
          <Tooltip title="ALL Groups">
            <button onClick={navigateGroup}>
              <MdGroups2 className="text-4xl text-white font-bold" />
            </button>
          </Tooltip>
          <Tooltip title="Notifications">
            <button  onClick={handleNotification}>
            <Badge count={NotificationCount}>
              <IoNotificationsSharp className="text-3xl text-white font-bold" />
            </Badge>
            </button>
          </Tooltip>
          <Tooltip title="Log Out">
            <button onClick={handleLogout}>
              <IoLogOutOutline className="text-3xl text-white font-bold" />
            </button>
          </Tooltip>
        </div>
      </div>
      
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}

        
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notification />
        </Suspense>
      )}  
         {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <Group />
        </Suspense>
      )}  
    </>
  );
};

export default Header;
