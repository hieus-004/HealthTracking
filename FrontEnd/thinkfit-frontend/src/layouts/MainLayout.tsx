import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout: React.FC = () => {
  // State quản lý trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Logic thực tế: Kiểm tra xem có token xác thực trong trình duyệt không
    // (Ông có thể thay thế bằng logic từ Redux hoặc AuthContext của dự án)
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    // Nền tổng thể đổi từ #121212 sang gray-50
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung chính bên phải */}
      <main className="flex-1 overflow-y-auto">
        {/* Header dùng chung - Nền mờ sáng, viền xám nhạt */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-end px-8 bg-gray-50/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium tracking-wide">
            <span>System Status: <span className="text-emerald-500 font-bold uppercase">Online</span></span>
            
            {/* Rẽ nhánh hiển thị UI dựa trên trạng thái đăng nhập */}
            {isLoggedIn ? (
              // Nếu ĐÃ đăng nhập -> Hiển thị Avatar Placeholder
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-md transition-all">
                <i className="fa-solid fa-user text-slate-300"></i>
              </div>
            ) : (
              // Nếu CHƯA đăng nhập -> Hiển thị nút Đăng nhập
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300 outline-none"
              >
                Đăng nhập
              </Link>
            )}
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