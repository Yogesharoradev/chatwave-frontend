import React from 'react';
import { Avatar } from 'antd';
import moment from 'moment';
import { FaRegUser } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { MdDateRange } from 'react-icons/md';
import { TransformImage } from '../lib/features';

const Profile = ({user}) => {
  return (
    <div className="flex flex-col items-center space-y-3 bg-slate-950 h-full w-full p-6 md:p-0">
      <Avatar className="w-32 h-32 border-2 border-white" src = { TransformImage(user?.avatar?.url)}></Avatar>
      <ProfileCard heading="bio" text={user?.bio} />
      <ProfileCard heading="username" text={user?.username} icon={<FaRegUser className="h-8 w-8" />} />
      <ProfileCard heading="Name" text={user?.name} icon={<CgProfile className="h-8 w-8" />} />
      <ProfileCard
        heading="Joined"
        text={moment(user?.createdAt).fromNow()}
        icon={<MdDateRange className="h-8 w-8" />}
      />
    </div>
  );
};

const ProfileCard = ({ text, icon, heading }) => (
  <div className="flex flex-col justify-center items-center text-white text-center">
    <div className="flex items-center m-3">{icon && icon}</div>
    <div className="flex flex-col items-center">
      <h1 className="font-semibold text-lg">{text}</h1>
      <h1 className="text-sm text-gray-400">{heading}</h1>
    </div>
  </div>
);

export default Profile;
