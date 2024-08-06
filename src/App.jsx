import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedAuth from './components/auth/ProtectedAuth';
import { LayoutLoaders } from './layout/loaders';
import axios from 'axios';
import { server } from './constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth';
import {SocketProvider} from "./socket"
import AdminLayout from './layout/adminlayout';


const Home = lazy(() => import('./pages/home'));
const Login = lazy(() => import('./pages/login'));
const Chat = lazy(() => import('./pages/chat'));
const Groups = lazy(() => import('./pages/groups'));
const NotFound = lazy(() => import('./pages/notFound'));
const AdminLogin = lazy(() => import('./pages/admin/adminlogin'));
const Dashboard = lazy(() => import('./pages/admin/dashboard'));
const Messages = lazy(() => import('./pages/admin/messages'));
const Users = lazy(() => import('./pages/admin/users'));
const AdminChats = lazy(() => import('./pages/admin/chats'));
const Logout = lazy(() => import('./pages/admin/logout'));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/user/me`, { withCredentials: true });
        dispatch(userExists(data.user));
      } catch (error) {
        console.error("Error fetching user:", error);
        dispatch(userNotExists());
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loader) {
    return <LayoutLoaders />;
  }

  return (
    <Router>
      <Suspense fallback={<LayoutLoaders />}>
        <Routes>
          <Route element={
            <SocketProvider>
             <ProtectedAuth user={user} />
            </SocketProvider>
          }>
            <Route path='/' element={<Home />} />
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/groups' element={<Groups />} />
          </Route>

          <Route path='/login' element={
            <ProtectedAuth user={!user} redirect='/'>
              <Login />
            </ProtectedAuth>
          }/>

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/chats" element={<AdminChats />} />
          
          <Route path="/admin/logout" element={<Logout />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
