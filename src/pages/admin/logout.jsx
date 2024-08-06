import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAdminLogOutQuery } from '../../redux/api/api';
import { message } from 'antd';
import { userNotExists } from '../../redux/reducers/auth';

const Logout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { refetch } = useAdminLogOutQuery();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await refetch();
        dispatch(userNotExists());
        message.success("Logout successful");
      } catch (err) {
        message.error("Logout failed");
        console.log(err);
      }
    };
    performLogout();
  }, [dispatch, refetch]);

  if (user === null) {
    return <Navigate to="/admin" />;
  }

  return null;
};

export default Logout;
