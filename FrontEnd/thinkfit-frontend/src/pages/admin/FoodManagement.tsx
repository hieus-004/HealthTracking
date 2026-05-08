import React, { useState } from 'react';

// --- MOCK DATA (Khớp với Entity Food trong Spring Boot) ---
const mockFoods = [
  { id: 1, foodName: 'Ức gà nướng (Skinless)', desc: 'Nguồn protein nạc phổ biến', calories: 165, protein: 31, carb: 0, fat: 3.6, category: 'Thịt (Meat)', dietType: 'Normal', origin: 'Nội địa' },
  { id: 2, foodName: 'Gạo lứt (Brown Rice)', desc: 'Tinh bột hấp thu chậm', calories: 111, protein: 2.6, carb: 23, fat: 0.9, category: 'Tinh bột (Carb)', dietType: 'Vegan', origin: 'Châu Á' },
  { id: 3, foodName: 'Whey Protein Isolate', desc: 'Sữa tăng cơ hấp thu nhanh', calories: 110, protein: 25, carb: 1, fat: 0.5, category: 'Thực phẩm bổ sung', dietType: 'Vegetarian', origin: 'Nhập khẩu' },
  { id: 4, foodName: 'Cá hồi áp chảo', desc: 'Giàu Omega-3 và chất béo tốt', calories: 206, protein: 22, carb: 0, fat: 13, category: 'Hải sản (Seafood)', dietType: 'Keto', origin: 'Na Uy' },
  { id: 5, foodName: 'Bông cải xanh (Broccoli)', desc: 'Nhiều xơ và vitamin', calories: 34, protein: 2.8, carb: 6.6, fat: 0.4, category: 'Rau củ (Veggie)', dietType: 'Vegan', origin: 'Nội địa' },
  { id: 6, foodName: 'Quả Bơ (Avocado)', desc: 'Nguồn chất béo thực vật dồi dào', calories: 160, protein: 2, carb: 8.5, fat: 14.7, category: 'Trái cây (Fruit)', dietType: 'Keto', origin: 'Đà Lạt' },
];

const FoodManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDiet, setFilterDiet] = useState('All');

  // Logic lọc dữ liệu 3 lớp: Tên + Danh mục + Chế độ ăn
  const filteredFoods = mockFoods.filter(food => {
    const matchName = food.foodName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'All' || food.category.includes(filterCategory);
    const matchDiet = filterDiet === 'All' || food.dietType === filterDiet;
    return matchName && matchCategory && matchDiet;
  });

  // Render Badge cho Chế độ ăn (Diet Type)
  const renderDietBadge = (diet: string) => {
    switch (diet) {
      case 'Vegan': return <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider"><i className="fa-solid fa-leaf mr-1"></i>Vegan</span>;
      case 'Keto': return <span className="px-2 py-1 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wider">Keto</span>;
      case 'Vegetarian': return <span className="px-2 py-1 rounded text-[10px] font-bold bg-lime-100 text-lime-700 uppercase tracking-wider">Vegetarian</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Dữ liệu Thực phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Từ điển Master Data cung cấp chỉ số Calories và Macros trên 100g.</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Thực phẩm
        </button>
      </div>

      {/* 2. Toolbar: Search & Multi-Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-1/3">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Tìm món ăn..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Danh mục:</span>
            <select 
              className="w-full sm:w-auto border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">Tất cả</option>
              <option value="Thịt">Thịt (Meat)</option>
              <option value="Hải sản">Hải sản (Seafood)</option>
              <option value="Tinh bột">Tinh bột (Carb)</option>
              <option value="Rau củ">Rau củ (Veggie)</option>
              <option value="Thực phẩm bổ sung">TPBS (Supplement)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Chế độ ăn:</span>
            <select 
              className="w-full sm:w-auto border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterDiet}
              onChange={(e) => setFilterDiet(e.target.value)}
            >
              <option value="All">Tất cả</option>
              <option value="Normal">Phổ thông (Normal)</option>
              <option value="Vegan">Thuần chay (Vegan)</option>
              <option value="Keto">Keto (Ít Carb, Giàu béo)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">Thông tin Thực phẩm</th>
                <th className="px-6 py-4">Phân loại</th>
                <th className="px-6 py-4 min-w-[280px]">Hàm lượng Dinh dưỡng (Mức 100g)</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{food.id}</td>
                    
                    {/* Cột Thông tin: Gộp Tên, Chế độ ăn và Nguồn gốc */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-800 text-base">{food.foodName}</span>
                          {renderDietBadge(food.dietType)}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          <i className="fa-solid fa-location-dot text-gray-400 mr-1"></i> {food.origin}
                        </span>
                      </div>
                    </td>

                    {/* Cột Phân loại */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {food.category}
                      </span>
                    </td>

                    {/* Cột Macros: Hiển thị như một Mini-Dashboard */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {/* Kcal */}
                        <div className="flex flex-col items-center bg-gray-50 px-2 py-1 rounded border border-gray-200 min-w-[50px]">
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Kcal</span>
                          <span className="text-sm font-bold text-gray-800">{food.calories}</span>
                        </div>
                        {/* Protein */}
                        <div className="flex flex-col items-center bg-red-50 px-2 py-1 rounded border border-red-100 min-w-[50px]">
                          <span className="text-[10px] text-red-400 uppercase font-bold">Pro</span>
                          <span className="text-sm font-bold text-red-700">{food.protein}g</span>
                        </div>
                        {/* Carb */}
                        <div className="flex flex-col items-center bg-blue-50 px-2 py-1 rounded border border-blue-100 min-w-[50px]">
                          <span className="text-[10px] text-blue-400 uppercase font-bold">Carb</span>
                          <span className="text-sm font-bold text-blue-700">{food.carb}g</span>
                        </div>
                        {/* Fat */}
                        <div className="flex flex-col items-center bg-yellow-50 px-2 py-1 rounded border border-yellow-200 min-w-[50px]">
                          <span className="text-[10px] text-yellow-600 uppercase font-bold">Fat</span>
                          <span className="text-sm font-bold text-yellow-700">{food.fat}g</span>
                        </div>
                      </div>
                    </td>

                    {/* Cột Hành động */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-gray-400 hover:text-green-600 transition-colors" title="Chỉnh sửa">
                          <i className="fa-regular fa-pen-to-square text-lg"></i>
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors" title="Xóa thực phẩm">
                          <i className="fa-regular fa-trash-can text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy dữ liệu thực phẩm nào phù hợp.
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

export default FoodManagement;