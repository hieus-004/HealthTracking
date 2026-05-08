import React, { useState } from 'react';

// --- MOCK DATA (Mô phỏng Entity BodyPart + Relational Data) ---
// Tôi thêm jointCount và exerciseCount để mô phỏng việc query hàm COUNT() từ DB
const mockBodyParts = [
  { id: 1, partName: 'Ngực (Chest)', jointCount: 2, exerciseCount: 24 },
  { id: 2, partName: 'Lưng (Back)', jointCount: 3, exerciseCount: 35 },
  { id: 3, partName: 'Đùi (Legs)', jointCount: 4, exerciseCount: 42 },
  { id: 4, partName: 'Vai (Shoulders)', jointCount: 2, exerciseCount: 18 },
  { id: 5, partName: 'Tay (Arms)', jointCount: 3, exerciseCount: 28 },
  { id: 6, partName: 'Bụng (Core/Abs)', jointCount: 1, exerciseCount: 15 },
  { id: 7, partName: 'Bắp chân (Calves)', jointCount: 1, exerciseCount: 6 },
];

const BodyPartManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc dữ liệu theo tên nhóm cơ
  const filteredParts = mockBodyParts.filter(part => 
    part.partName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhóm cơ</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các nhóm cơ giải phẫu học làm cơ sở cho bài tập và chấn thương.</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Nhóm cơ
        </button>
      </div>

      {/* 2. Toolbar: Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Nhập tên nhóm cơ cần tìm..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 hidden md:block">
          Tổng số: <span className="font-bold text-teal-600">{filteredParts.length}</span> danh mục
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-24">ID</th>
                <th className="px-6 py-4">Tên phân vùng Nhóm cơ</th>
                <th className="px-6 py-4 text-center">Số lượng Khớp liên kết</th>
                <th className="px-6 py-4 text-center">Số lượng Bài tập</th>
                <th className="px-6 py-4 text-center w-32">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredParts.length > 0 ? (
                filteredParts.map((part) => (
                  <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{part.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-teal-50 text-teal-600 flex items-center justify-center">
                          <i className="fa-solid fa-child-reaching"></i>
                        </div>
                        <span className="font-semibold text-gray-800 text-base">{part.partName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 w-16">
                        {part.jointCount} khớp
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 w-16">
                        {part.exerciseCount} bài
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-gray-400 hover:text-teal-600 transition-colors" title="Chỉnh sửa">
                          <i className="fa-regular fa-pen-to-square text-lg"></i>
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors" title="Xóa nhóm cơ">
                          <i className="fa-regular fa-trash-can text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy nhóm cơ nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BodyPartManagement;