import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSideBar'; // Trỏ đúng đường dẫn import

const AdminLayout: React.FC = () => {
  const location = useLocation();

  // Hàm phụ để hiển thị động tên trang trên Header dựa vào URL
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('users')) return 'Quản lý Người dùng';
    if (path.includes('exercises')) return 'Quản lý Bài tập';
    if (path.includes('body-parts')) return 'Quản lý Nhóm cơ';
    if (path.includes('foods')) return 'Quản lý Thực phẩm';
    if (path.includes('joints')) return 'Quản lý Khớp & Chấn thương';
    return 'Dashboard Thống kê';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Component Sidebar Admin đã được tách riêng */}
      <AdminSidebar />

      {/* Khu vực nội dung chính bên phải */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header của Admin */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center text-sm text-gray-500">
            <i className="fa-solid fa-bars mr-4 cursor-pointer hover:text-gray-900 transition-colors"></i>
            <span>
              Trang quản trị / <span className="font-semibold text-gray-800">{getPageTitle()}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Nơi hiển thị các trang con (Outlet) */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
};

export default AdminLayout;