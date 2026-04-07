import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

// Định nghĩa lại các Interface khớp với Backend
interface DailyMacroResponse {
  calories: number; cCalories: number;
  protein: number; cProtein: number;
  carbs: number; cCarbs: number;
  fat: number; cFat: number;
}

interface UserBodyResponse {
  userName: string; height: number; weight: number;
  bmi: number; smm: number | null; 
}

interface WeightRangeResponse {
  minWeight: number; maxWeight: number;
}

const userId = 1;

function App() {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [nutrition, setNutrition] = useState<DailyMacroResponse | null>(null);
  const [bodyInfo, setBodyInfo] = useState<UserBodyResponse | null>(null);
  const [weightRange, setWeightRange] = useState<WeightRangeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- 2. FETCH DATA TỪ BACKEND ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch song song 3 API để tối ưu tốc độ
        const [nutriRes, bodyRes, rangeRes] = await Promise.all([
          axiosClient.get<DailyMacroResponse>(`/nutri/todayMacro/${userId}`), 
          axiosClient.get<UserBodyResponse>(`/user/${userId}/bodyInfo`), 
          axiosClient.get<WeightRangeResponse>(`/nutri/${userId}/weightRange`)
        ]);

        setNutrition(nutriRes.data);
        setBodyInfo(bodyRes.data);
        setWeightRange(rangeRes.data);
      } catch (error) {
        console.error("Lỗi hệ thống Lab:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !nutrition || !bodyInfo) {
    return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#e22718] font-black italic uppercase tracking-widest">Loading ThinkFit Systems...</div>;
  }

  // Logic tính toán nhanh cho UI
  const remainingCalories = nutrition.calories - nutrition.cCalories;
  const progressPercent = Math.round((nutrition.cCalories / nutrition.calories) * 100);

  // Mảng Macros để map() ra UI
  const macros = [
    { name: "Protein", current: nutrition.cProtein, target: nutrition.protein, color: "blue" },
    { name: "Carbs", current: nutrition.cCarbs, target: nutrition.carbs, color: "green" },
    { name: "Fat", current: nutrition.cFat, target: nutrition.fat, color: "yellow" },
  ];

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-gray-200 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Dữ liệu động từ bodyInfo */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold italic text-white uppercase">
              Think<span className="text-[#e22718]">Fit</span>_
            </h1>
            <p className="text-gray-400 text-sm italic">Chào {bodyInfo.userName}, mục tiêu Calo hôm nay đạt {progressPercent}%.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{bodyInfo.userName}</p>
              <p className="text-xs text-gray-500 italic">Backend Developer / N3 Japanese</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-[#e22718]/50 flex items-center justify-center overflow-hidden">
               <i className="fa-solid fa-user text-gray-400"></i>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI: DINH DƯỠNG (Dùng số liệu từ nutrition API) */}
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 flex flex-col items-center justify-center border-t-2 border-t-[#e22718]">
            <h3 className="text-[10px] font-bold mb-4 self-start uppercase tracking-[0.2em] text-gray-500">Daily_Nutrition</h3>
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-800" strokeWidth="2" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-[#e22718] transition-all duration-1000" 
                  strokeWidth="2" 
                  strokeDasharray={`${Math.min(100, (nutrition.cCalories / nutrition.calories) * 100)} 100`} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{remainingCalories.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Calo còn lại</span>
              </div>
            </div>
            
            <div className="w-full space-y-4">
              {macros.map((macro, index) => (
                <div key={index}>
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1 tracking-tighter">
                    <span className="text-gray-400">{macro.name}</span>
                    <span className={`text-${macro.color}-400`}>{Math.round(macro.current)}/{macro.target}g</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1">
                    <div className={`bg-${macro.color}-500 h-1 rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, (macro.current / macro.target) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: CHỈ SỐ CƠ THỂ */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cân nặng hiện tại */}
              <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Cân nặng (kg)</p>
                <p className="text-3xl font-black text-white">{bodyInfo.weight}</p>
                
                {/* Thanh Weight Range động */}
                <div className="mt-4 h-1.5 bg-gray-800 rounded-full relative">
                  <div className="absolute left-1/4 right-1/4 h-full bg-green-500/20 border-x border-green-500/50"></div>
                  {/* Con trỏ cân nặng thực tế */}
                  <div className="absolute top-[-3px] w-3 h-3 bg-[#e22718] rounded-full border-2 border-white shadow-lg" style={{ left: '50%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[9px] text-gray-600 font-bold uppercase">
                  <span>Min: {weightRange?.minWeight}kg</span>
                  <span>Max: {weightRange?.maxWeight}kg</span>
                </div>
              </div>
              
              {/* Khối lượng cơ SMM */}
              <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 border-l-2 border-l-blue-500">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Khối lượng cơ (SMM)</p>
                <p className="text-3xl font-black text-white">{bodyInfo.smm || "--"} <span className="text-sm font-normal text-gray-500">kg</span></p>
                <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase italic">
                  Chỉ số BMI: {bodyInfo.bmi}
                </p>
              </div>
            </div>

            {/* AI Insight Section (Tạm thời xử lý logic tại Frontend) */}
            <div className="bg-[#1e1e1e] border border-[#333] border-l-4 border-l-[#e22718] p-5 bg-red-900/5 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <i className="fa-solid fa-robot text-[#e22718] mt-1 text-xs"></i>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-[#e22718] tracking-[0.2em] mb-1">System_Advisor_</h4>
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    Dựa trên cân nặng {bodyInfo.weight}kg, mục tiêu calo lý tưởng của bạn là {nutrition.calories} kcal. 
                    {remainingCalories > 0 
                      ? ` Bạn cần nạp thêm ${Math.round(remainingCalories)} calo nữa để hoàn thành mục tiêu ngày.` 
                      : " Bạn đã đạt/vượt mức calo mục tiêu. Hãy chú ý các bài tập Cardio để cân bằng."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;