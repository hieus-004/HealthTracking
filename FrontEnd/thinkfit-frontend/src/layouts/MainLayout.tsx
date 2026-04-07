import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#121212]">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung chính bên phải */}
      <main className="flex-1 overflow-y-auto">
        {/* Header dùng chung nếu muốn (Optional) */}
        <header className="h-16 border-b border-[#333] flex items-center justify-end px-8 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <span>System Status: <span className="text-green-500">Online</span></span>
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700"></div>
          </div>
        </header>

        {/* Các trang con (Dashboard, MetricsLab...) sẽ hiển thị ở đây */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;