import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// --- MOCK DATA ---
const kpiData = [
  { id: 1, title: 'Tổng Người Dùng', value: '1,245', icon: 'fa-users', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, title: 'Tổng Bài Tập', value: '342', icon: 'fa-dumbbell', color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 3, title: 'Dữ liệu Thực phẩm', value: '8,421', icon: 'fa-bowl-food', color: 'text-green-600', bg: 'bg-green-100' },
  { id: 4, title: 'Lượt hỏi AI Agent', value: '15,203', icon: 'fa-robot', color: 'text-purple-600', bg: 'bg-purple-100' },
];

const userGrowthData = [
  { name: 'T1', users: 400 },
  { name: 'T2', users: 600 },
  { name: 'T3', users: 800 },
  { name: 'T4', users: 1100 },
  { name: 'T5', users: 1500 },
  { name: 'T6', users: 1245 },
];

const activityData = [
  { name: 'Tăng cơ', count: 450 },
  { name: 'Giảm mỡ', count: 650 },
  { name: 'Duy trì', count: 145 },
];

const recentUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nva@gmail.com', target: 'Giảm mỡ', date: '2026-05-04' },
  { id: 2, name: 'Trần Thị B', email: 'ttb@gmail.com', target: 'Tăng cơ', date: '2026-05-03' },
  { id: 3, name: 'Lê Hoàng C', email: 'lhc@gmail.com', target: 'Duy trì', date: '2026-05-03' },
  { id: 4, name: 'Phạm Văn D', email: 'pvd@gmail.com', target: 'Giảm mỡ', date: '2026-05-02' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi các chỉ số quan trọng của ứng dụng Fitness & Nutrition.</p>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${item.bg}`}>
              <i className={`fa-solid ${item.icon} text-2xl ${item.color}`}></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart: User Growth */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tăng trưởng Người dùng (6 tháng qua)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: User Targets */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tỉ lệ Mục tiêu Hình thể</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} width={40} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Recent Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Người dùng mới đăng ký</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Người dùng</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Mục tiêu</th>
                <th className="px-6 py-3">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                      ${user.target === 'Giảm mỡ' ? 'bg-green-100 text-green-700' : 
                        user.target === 'Tăng cơ' ? 'bg-orange-100 text-orange-700' : 
                        'bg-gray-100 text-gray-700'}`}>
                      {user.target}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;