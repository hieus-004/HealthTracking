import React, { useState } from 'react';

// --- MOCK DATA (Khớp với Entity Exercises trong Spring Boot) ---
const mockExercises = [
  { id: 1, exName: 'Barbell Bench Press', exNameVN: 'Đẩy ngực ngang với tạ đòn', bodyPart: 'Ngực (Chest)', equipment: 'Barbell', type: 'Compound', difficulty: 2 },
  { id: 2, exName: 'Dumbbell Lateral Raise', exNameVN: 'Dang tạ đôi hai bên', bodyPart: 'Vai (Shoulder)', equipment: 'Dumbbell', type: 'Isolation', difficulty: 1 },
  { id: 3, exName: 'Barbell Squat', exNameVN: 'Gánh tạ đòn ngồi xổm', bodyPart: 'Đùi (Legs)', equipment: 'Barbell', type: 'Compound', difficulty: 3 },
  { id: 4, exName: 'Lat Pulldown', exNameVN: 'Kéo xô máy cáp', bodyPart: 'Lưng (Back)', equipment: 'Machine', type: 'Compound', difficulty: 1 },
  { id: 5, exName: 'Leg Extension', exNameVN: 'Đá đùi trước máy', bodyPart: 'Đùi (Legs)', equipment: 'Machine', type: 'Isolation', difficulty: 1 },
  { id: 6, exName: 'Romanian Deadlift', exNameVN: 'Gập hông tạ đòn', bodyPart: 'Lưng dưới/Đùi sau', equipment: 'Barbell', type: 'Compound', difficulty: 3 },
];

const ExerciseManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPart, setFilterPart] = useState('All');

  // Lọc dữ liệu theo tên (EN/VN) và Nhóm cơ
  const filteredExercises = mockExercises.filter(ex => {
    const matchName = ex.exName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      ex.exNameVN.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPart = filterPart === 'All' || ex.bodyPart.includes(filterPart);
    return matchName && matchPart;
  });

  // Render số sao biểu diễn độ khó (1: Dễ, 2: Vừa, 3: Khó)
  const renderDifficulty = (level: number) => {
    const stars = [];
    for (let i = 1; i <= 3; i++) {
      if (i <= level) {
        stars.push(<i key={i} className={`fa-solid fa-star ${level === 1 ? 'text-green-500' : level === 2 ? 'text-yellow-500' : 'text-red-500'} text-xs`}></i>);
      } else {
        stars.push(<i key={i} className="fa-regular fa-star text-gray-300 text-xs"></i>);
      }
    }
    return (
      <div className="flex items-center space-x-1" title={`Độ khó: ${level}/3`}>
        {stars}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Thư viện Bài tập</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý danh sách, kỹ thuật và thông số sinh cơ học của các bài tập.</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Bài tập mới
        </button>
      </div>

      {/* 2. Toolbar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Tìm theo tên Tiếng Anh hoặc Tiếng Việt..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Nhóm cơ:</span>
            <select 
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filterPart}
              onChange={(e) => setFilterPart(e.target.value)}
            >
              <option value="All">Tất cả</option>
              <option value="Ngực">Ngực (Chest)</option>
              <option value="Lưng">Lưng (Back)</option>
              <option value="Vai">Vai (Shoulder)</option>
              <option value="Đùi">Đùi (Legs)</option>
              <option value="Tay">Tay (Arms)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Tên bài tập (EN/VN)</th>
                <th className="px-6 py-4">Nhóm cơ chính</th>
                <th className="px-6 py-4 text-center">Thiết bị</th>
                <th className="px-6 py-4">Phân loại</th>
                <th className="px-6 py-4 text-center">Độ khó</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((ex) => (
                  <tr key={ex.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{ex.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{ex.exName}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{ex.exNameVN}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {ex.bodyPart}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1 text-gray-600">
                        {ex.equipment === 'Barbell' && <i className="fa-solid fa-dumbbell rotate-45" title="Tạ đòn"></i>}
                        {ex.equipment === 'Dumbbell' && <i className="fa-solid fa-dumbbell" title="Tạ đơn"></i>}
                        {ex.equipment === 'Machine' && <i className="fa-solid fa-gear" title="Máy tập"></i>}
                        <span className="ml-2">{ex.equipment}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        ex.type === 'Compound' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-blue-200 bg-blue-50 text-blue-700'
                      }`}>
                        {ex.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {renderDifficulty(ex.difficulty)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-gray-400 hover:text-orange-600 transition-colors" title="Chỉnh sửa">
                          <i className="fa-regular fa-pen-to-square text-lg"></i>
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors" title="Xóa bài tập">
                          <i className="fa-regular fa-trash-can text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy bài tập nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 4. Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500">
            Hiển thị <span className="font-medium text-gray-700">1</span> đến <span className="font-medium text-gray-700">{filteredExercises.length}</span> trong số <span className="font-medium text-gray-700">{mockExercises.length}</span> kết quả
          </span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-100">Tiếp</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ExerciseManagement;