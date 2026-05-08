import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  // Trạng thái thu nhỏ/mở rộng
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'fa-chart-line' },
    { name: 'Metrics Lab', path: '/metrics', icon: 'fa-flask' },
    { name: 'Evolution', path: '/evolution', icon: 'fa-arrow-trend-up' },
    { name: 'Muscle Target', path: '/muscleTarget', icon: 'fa-male'},
    { name: 'Nutrition Tracker', path: '/nutrition', icon: 'fa-cutlery'},
    { name: 'Workout Plan', path: '/workoutPlan', icon: 'fa-calendar' },
  ];

  return (
    <aside 
      // Nền trắng, viền xám nhạt, thêm shadow nhẹ để tách biệt với phần main
      className={`bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header & Toggle Button */}
      <div className={`p-6 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          // Chữ THINK màu slate-900
          <h1 className="text-xl font-black italic text-slate-900 tracking-tighter transition-opacity duration-300">
            THINK<span className="text-[#e22718]">FIT</span>_
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          // Nút toggle màu xám, hover lên nền xám nhạt
          className="text-slate-400 hover:text-slate-800 hover:bg-gray-100 rounded transition-colors p-1.5"
          title={isCollapsed ? "Mở rộng" : "Thu nhỏ"}
        >
          <i className={`fa-solid ${isCollapsed ? 'fa-indent' : 'fa-outdent'} text-lg`}></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center py-3 rounded-md transition-all ${
                isCollapsed ? 'justify-center px-0' : 'px-4'
              } ${
                isActive 
                // Active: nền đỏ siêu nhạt (red-50), chữ đỏ
                ? 'bg-red-50 text-[#e22718] border-l-4 border-[#e22718]' 
                // Inactive: chữ xám (slate-500), hover nền xám nhạt (gray-50)
                : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900 border-l-4 border-transparent'
              }`
            }
          >
            <i className={`fa-solid ${item.icon} text-lg ${isCollapsed ? '' : 'mr-3 w-5'}`}></i>
            {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer info */}
      <div className={`p-4 border-t border-gray-200 text-center ${isCollapsed ? 'block' : 'text-left'}`}>
        {/* Chữ version màu xám nhạt (slate-400) */}
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          {isCollapsed ? 'v1.0' : 'v1.0.0 Stable'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;