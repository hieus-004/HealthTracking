import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Dashboard Thống kê', icon: 'fa-chart-pie' },
    { path: '/admin/users', label: 'Quản lý Người dùng', icon: 'fa-users' },
    { path: '/admin/exercises', label: 'Quản lý Bài tập', icon: 'fa-dumbbell' },
    { path: '/admin/body-parts', label: 'Quản lý Nhóm cơ', icon: 'fa-child' },
    { path: '/admin/foods', label: 'Quản lý Thực phẩm', icon: 'fa-utensils' },
    { path: '/admin/joints', label: 'Khớp & Chấn thương', icon: 'fa-bone' },
  ];

  const handleLogout = () => {
    // Xóa token và role
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 shrink-0">
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800 bg-slate-950 shrink-0">
        <i className="fa-solid fa-shield-halved text-emerald-500 mr-2 text-xl"></i>
        <h1 className="text-lg font-bold tracking-wider uppercase text-white">
          Admin <span className="text-emerald-500">Portal</span>
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Hệ thống quản trị
        </p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center text-lg`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">System Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@system.com</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;