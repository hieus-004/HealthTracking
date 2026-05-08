import React, { useState } from 'react';

// --- MOCK DATA (Gộp dữ liệu từ bảng Joints và Injury) ---
const mockJoints = [
  { id: 1, jointName: 'Khớp xoay vai (Rotator Cuff)', partName: 'Vai (Shoulders)', injuryCount: 15, status: 'High Risk' },
  { id: 2, jointName: 'Khớp khuỷu tay (Elbow)', partName: 'Tay (Arms)', injuryCount: 5, status: 'Stable' },
  { id: 3, jointName: 'Khớp gối (Knee)', partName: 'Đùi (Legs)', injuryCount: 22, status: 'High Risk' },
  { id: 4, jointName: 'Cổ tay (Wrist)', partName: 'Tay (Arms)', injuryCount: 8, status: 'Stable' },
  { id: 5, jointName: 'Đốt sống thắt lưng (L4-L5)', partName: 'Lưng (Back)', injuryCount: 12, status: 'Warning' },
  { id: 6, jointName: 'Khớp hông (Hip Joint)', partName: 'Đùi (Legs)', injuryCount: 3, status: 'Stable' },
];

const JointManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJoints = mockJoints.filter(j => 
    j.jointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.partName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render Badge trạng thái rủi ro dựa trên số lượng chấn thương được báo cáo
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'High Risk': 
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">NGUY CƠ CAO</span>;
      case 'Warning': 
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">CẦN LƯU Ý</span>;
      default: 
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">ỔN ĐỊNH</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khớp & Rủi ro Chấn thương</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi các vùng khớp nhạy cảm và thống kê dữ liệu chấn thương từ người dùng.</p>
        </div>
        <div className="flex space-x-3">
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Xem báo cáo chấn thương
            </button>
            <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
                <i className="fa-solid fa-plus mr-2"></i> Thêm Khớp mới
            </button>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Tìm theo tên khớp hoặc nhóm cơ..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">Tên Khớp Xương</th>
                <th className="px-6 py-4">Thuộc Nhóm Cơ</th>
                <th className="px-6 py-4 text-center">Số ca chấn thương ghi nhận</th>
                <th className="px-6 py-4 text-center">Trạng thái rủi ro</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJoints.length > 0 ? (
                filteredJoints.map((joint) => (
                  <tr key={joint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{joint.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            joint.status === 'High Risk' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <i className="fa-solid fa-bone"></i>
                        </div>
                        <span className="font-bold text-gray-800">{joint.jointName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{joint.partName}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-lg font-bold ${joint.injuryCount > 10 ? 'text-red-600' : 'text-gray-800'}`}>
                            {joint.injuryCount}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase">Trường hợp</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderStatusBadge(joint.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-gray-400 hover:text-rose-600 transition-colors">
                          <i className="fa-regular fa-pen-to-square text-lg"></i>
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <i className="fa-regular fa-trash-can text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy dữ liệu khớp nào phù hợp.
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

export default JointManagement;