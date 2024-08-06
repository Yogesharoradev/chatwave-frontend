import React from 'react';
import { Avatar, Space, Spin, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AdminLayout from '../../layout/adminlayout';
import { useAdminchatsQuery } from '../../redux/api/api';
import moment from 'moment';

const Chats = () => {
  const { data, error, isLoading } = useAdminchatsQuery();
  
  if (isLoading) return <div className="p-4"><Spin tip="Loading..." /></div>;
  
  if (error) return <div className="p-4 flex items-center justify-center"><p>Error loading data</p></div>;

  const transformedChats = data?.transformedChats || [];

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatarUrls) => (
        <div>
          {avatarUrls.map((url, index) => (
            <Avatar key={index} src={url} icon={<UserOutlined />} style={{ marginRight: 8 }} />
          ))}
        </div>
      ),
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: 'Total Members',
      dataIndex: 'totalMembers',
      key: 'totalMembers',
      responsive: ['md', 'lg'],
    },
    {
      title: 'Members With',
      dataIndex: 'members',
      key: 'members',
      render: (members) => members.map(member => member.name).join(', '),
      responsive: ['md', 'lg'],
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
      render: (creator) => (
        <div>
          <Avatar src={creator.avatar} icon={<UserOutlined />} />
          {creator.name}
        </div>
      ),
      responsive: ['lg'],
    },
    {
      title: 'Total Messages',
      dataIndex: 'totalMessages',
      key: 'totalMessages',
      responsive: ['lg'],
    },
   
  ];

  return (
    <AdminLayout>
      <div className="p-4">
        <Table
          dataSource={transformedChats}
          columns={columns}
          pagination={{ defaultPageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </AdminLayout>
  );
};

export default Chats;
