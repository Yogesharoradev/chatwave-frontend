import React, { useState, useEffect } from 'react';
import Sidebar from '../specific/sidebar';
import { FiMenu, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetAdminQuery } from '../redux/api/api';
import { userExists } from '../redux/reducers/auth';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state) => state.auth);
  const { data, error, isLoading } = useGetAdminQuery();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading
      if(data){
        dispatch(userExists(true))
      }else if(!data){
          navigate("/admin")
      }
  
  }, [data, error, isLoading, dispatch, navigate, isAdmin]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      <aside
        className={`md:hidden fixed top-0 right-0 w-64 h-full text-white p-4 transform transition-transform ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 1000, backgroundColor: 'rgb(0, 21, 42)' }}
      >
        <div className="flex justify-end">
          <button className="text-white p-2" onClick={toggleSidebar}>
            <FiX color="white" size={24} />
          </button>
        </div>
        <Sidebar />
      </aside>

      <aside
        className="hidden md:block w-64 text-white p-4 z-10"
        style={{ zIndex: 1000, backgroundColor: 'rgb(0, 21, 42)' }}
      >
        <nav style={{ minHeight: '100vh', backgroundColor: 'rgb(0, 21, 42)' }}>
          <Sidebar />
        </nav>
      </aside>

      <main className="flex-grow bg-slate-300 p-4 overflow-y-auto">
        <div className="md:hidden flex justify-end fixed top-0 right-0 m-4 z-20">
          <button className="text-white p-2" onClick={toggleSidebar}>
            <FiMenu color="blue" size={24} />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
