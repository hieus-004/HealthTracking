import React, { useState } from 'react';

// --- MOCK DATA (Khớp với Entity User trong Spring Boot) ---
const mockUsers = [
  { id: 1, userName: 'Nguyễn Văn A', email: 'nva@gmail.com', phoneNumber: '0901234567', gender: 'Male', age: 24, activityLevel: 'Lightly active' },
  { id: 2, userName: 'Trần Thị B', email: 'ttb@gmail.com', phoneNumber: '0912345678', gender: 'Female', age: 22, activityLevel: 'Sedentary' },
  { id: 3, userName: 'Lê Hoàng C', email: 'lhc@gmail.com', phoneNumber: '0923456789', gender: 'Male', age: 28, activityLevel: 'Moderately active' },
  { id: 4, userName: 'Phạm Văn D', email: 'pvd@gmail.com', phoneNumber: '0934567890', gender: 'Male', age: 21, activityLevel: 'Very active' },
  { id: 5, userName: 'Hoàng Thị E', email: 'hte@gmail.com', phoneNumber: '0945678901', gender: 'Female', age: 26, activityLevel: 'Lightly active' },
  { id: 6, userName: 'Vũ Đức F', email: 'vdf@gmail.com', phoneNumber: '0956789012', gender: 'Male', age: 30, activityLevel: 'Extra active' },
];

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  // Logic lọc data đơn giản trên Frontend
  const filteredUsers = mockUsers.filter(user => {
    const matchName = user.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = filterLevel === 'All' || user.activityLevel === filterLevel;
    return matchName && matchLevel;
  });

  // Hàm render badge màu sắc cho Activity Level
  const renderActivityBadge = (level: string) => {
    switch (level) {
      case 'Sedentary': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{level}</span>;
      case 'Lightly active': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{level}</span>;
      case 'Moderately active': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{level}</span>;
      case 'Very active': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{level}</span>;
      case 'Extra active': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{level}</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{level}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách tài khoản và thông tin thể trạng cơ bản.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm người dùng
        </button>
      </div>

      {/* 2. Toolbar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Cấp độ vận động:</span>
          <select 
            className="w-full md:w-48 border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="All">Tất cả</option>
            <option value="Sedentary">Sedentary (Ít vận động)</option>
            <option value="Lightly active">Lightly active (Nhẹ)</option>
            <option value="Moderately active">Moderately active (Vừa)</option>
            <option value="Very active">Very active (Nhiều)</option>
            <option value="Extra active">Extra active (Cực nhiều)</option>
          </select>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Họ và Tên</th>
                <th className="px-6 py-4">Liên hệ</th>
                <th className="px-6 py-4 text-center">Tuổi / Giới tính</th>
                <th className="px-6 py-4">Mức độ vận động tĩnh</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {user.userName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{user.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800">{user.email}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{user.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-800 font-medium">{user.age}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <i className={`fa-solid ${user.gender === 'Male' ? 'fa-mars text-blue-500' : 'fa-venus text-pink-500'} text-lg`}></i>
                    </td>
                    <td className="px-6 py-4">
                      {renderActivityBadge(user.activityLevel)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
                          <i className="fa-regular fa-pen-to-square text-lg"></i>
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors" title="Khóa/Xóa tài khoản">
                          <i className="fa-regular fa-trash-can text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 4. Pagination (Mock) */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500">
            Hiển thị <span className="font-medium text-gray-700">1</span> đến <span className="font-medium text-gray-700">{filteredUsers.length}</span> trong số <span className="font-medium text-gray-700">{mockUsers.length}</span> kết quả
          </span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-100">Tiếp</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserManagement;