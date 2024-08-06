import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  MessageOutlined,
  UserOutlined,
  WechatOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/admin/dashboard' },
  { key: 'users', icon: <UserOutlined />, label: 'Users', path: '/admin/users' },
  { key: 'messages', icon: <MessageOutlined />, label: 'Messages', path: '/admin/messages' },
  { key: 'chats', icon: <WechatOutlined />, label: 'Chats', path: '/admin/chats' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', path: '/admin/logout' },
];

const Sidebar = () => {

  const location = useLocation();
  const selectedKey = menuItems.find(item => item.path === location.pathname)?.key;
  return (
    <Sider
      breakpoint="md"
      collapsedWidth="0"
      width={240}
      style={{ height: '100vh' }}
      className="z-99999"
    >
      <div className="logo p-4 text-center text-3xl font-bold text-white">
        ChatWave
      </div>
      <Menu
        theme="dark"
        mode="inline"
      selectedKeys={[selectedKey]}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>
        }))}
        className="border-0"
      />
    </Sider>
  );
};

export default Sidebar;
