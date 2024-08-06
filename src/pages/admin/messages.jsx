import React from 'react';
import { Avatar, Space, Spin, Table } from 'antd';
import moment from 'moment';
import AdminLayout from '../../layout/adminlayout';
import { useAdminMessagesQuery } from '../../redux/api/api';

const Messages = () => {
  const { data, error, isLoading } = useAdminMessagesQuery();
  
  if (isLoading) return <div className="p-4"><Spin tip="Loading..." /></div>;
  
  if (error) return <div className="p-4 flex items-center justify-center"><Spin tip="Error loading data..." /></div>;

  const transformedMessages = data?.transformedMessages || [];

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      responsive: ['md'],
    },
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      render: (attachments) => attachments.length > 0 ? attachments.length : 'None',
      responsive: ['md'],
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      responsive: ['xs','sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Sent By',
      dataIndex: 'sender',
      key: 'sender',
      render: (sender) => (
        <div>
          <Avatar src={sender.avatar} />
          {sender.name}
        </div>
      ),
      responsive: ['xs','md'],
    },
    {
      title: 'Chat',
      dataIndex: 'chat',
      key: 'chat',
      responsive: ['xs','md'],
    },
    {
      title: 'Group Chat',
      dataIndex: 'groupChat',
      key: 'groupChat',
      responsive: ['md'],
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).fromNow(),
      responsive: ['md', 'lg', 'xl'],
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4">
        <Table
          dataSource={transformedMessages}
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

export default Messages;
