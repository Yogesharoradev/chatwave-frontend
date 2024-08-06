import React from 'react';
import { Table, Space, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AdminLayout from '../../layout/adminlayout';
import { useAdminUsersQuery } from '../../redux/api/api';
import moment from 'moment';

const Users = () => {
  const { data, error, isLoading } = useAdminUsersQuery();

  if (isLoading) return <div className="p-4"><Spin tip="Loading..." /></div>;

  if (error) return <div className="p-4"><p>Error loading data</p></div>;

  const transformedUsers = data?.transformedUsers || [];

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      responsive: ['md'],
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatarUrl) => <Avatar src={avatarUrl} icon={<UserOutlined />} />,
      responsive: ['xs','sm'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['sm'],
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      responsive: ['xs','sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Friends',
      dataIndex: 'friends',
      key: 'friends',
      responsive: ['md'],
    },
    {
      title: 'Group',
      dataIndex: 'groups',
      key: 'group',
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Date Joined',
      dataIndex: 'createdAt',
      key: 'dateJoin',
      render: (createdAt) => moment(createdAt).fromNow(),
      responsive: ['xs','lg', 'xl'],
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4">
        <Table
          dataSource={transformedUsers}
          columns={columns}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
          bordered
          responsive
        />
      </div>
    </AdminLayout>
  );
};

export default Users;
