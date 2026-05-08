import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

// --- 1. INTERFACES ---
interface DailyMacroResponse { 
  calories: number; cCalories: number; 
  protein: number; cProtein: number; 
  carbs: number; cCarbs: number; 
  fat: number; cFat: number; 
}
interface UserBodyResponse { userName: string; height: number; weight: number; bmi: number; smm: number | null; }
interface WeightRangeResponse { minWeight: number; maxWeight: number; }
interface WeeklyMacroResponse { date: string; cKcal: number; tKcal: number; }

// 🚀 THÊM: Interface cho Chấn thương
interface InjuryResponse { jointId: number; injuryScale: number; injuryName?: string }

const userId = 1;

function App() {
  // const navigate = useNavigate(); // Mở comment này nếu dùng chuyển trang

  const [nutrition, setNutrition] = useState<DailyMacroResponse | null>(null);
  const [bodyInfo, setBodyInfo] = useState<UserBodyResponse | null>(null);
  const [weightRange, setWeightRange] = useState<WeightRangeResponse | null>(null);
  const [weeklyData, setWeeklyData] = useState<{day: string; in: number; out: number}[]>([]);
  
  // 🚀 THÊM: State lưu trữ chấn thương hiện tại
  const [activeInjuries, setActiveInjuries] = useState<InjuryResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const navigate = useNavigate();

  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay(); 
    return dayIndex === 0 ? 'CN' : `T${dayIndex + 1}`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🚀 THÊM: Gọi API chấn thương song song với các API khác
        const [nutriRes, bodyRes, rangeRes, weeklyRes, injuryRes] = await Promise.all([
          axiosClient.get<DailyMacroResponse>(`/nutri/todayMacro/${userId}`, { params: { date: currentDate } }),
          axiosClient.get<UserBodyResponse>(`/user/${userId}/bodyInfo`), 
          axiosClient.get<WeightRangeResponse>(`/nutri/${userId}/weightRange`),
          axiosClient.get<WeeklyMacroResponse[]>(`/nutri/weekly/${userId}`, { params: { endDate: currentDate } }),
          axiosClient.get<any[]>(`/injury/${userId}`).catch(() => ({ data: [] })) // Catch lỗi riêng để không sập cả Dashboard
        ]);

        setNutrition(nutriRes.data);
        setBodyInfo(bodyRes.data);
        setWeightRange(rangeRes.data);
        
        // Map dữ liệu chấn thương (Giả định BE đã hỗ trợ gửi kèm tên khớp, nếu chưa thì ông chỉ lấy id và painLevel)
        if (injuryRes.data && injuryRes.data.length > 0) {
           const formattedInjuries = injuryRes.data.map(item => ({
             jointId: item.joint?.jointId || item.jointId,
             injuryScale: item.injuryScale,
             injuryName: item.injuryName || item.joint?.jointName || "Khớp"
           }));
           setActiveInjuries(formattedInjuries);
        } else {
           setActiveInjuries([]);
        }

        if (weeklyRes.data && weeklyRes.data.length > 0) {
          const formattedWeeklyData = weeklyRes.data.map(item => ({
            day: formatDay(item.date),
            in: item.cKcal || 0,
            out: item.tKcal || 2000 
          }));
          setWeeklyData(formattedWeeklyData);
        } else {
          setWeeklyData([]); 
        }

      } catch (error) {
        console.error("Lỗi hệ thống Lab:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [currentDate]); 

  if (isLoading || !nutrition || !bodyInfo || !weightRange) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#e22718] font-black italic uppercase tracking-widest">Loading ThinkFit Systems...</div>;
  }

  const remainingCalories = nutrition.calories - nutrition.cCalories;
  const progressPercent = Math.round((nutrition.cCalories / nutrition.calories) * 100);

  const macros = [
    { name: "Protein", current: nutrition.cProtein, target: nutrition.protein, color: "blue" },
    { name: "Carbs", current: nutrition.cCarbs, target: nutrition.carbs, color: "green" },
    { name: "Fat", current: nutrition.cFat, target: nutrition.fat, color: "yellow" },
  ];

  const rangeDiff = weightRange.maxWeight - weightRange.minWeight;
  let pointerPos = 50; 
  if (rangeDiff > 0) {
      pointerPos = ((bodyInfo.weight - weightRange.minWeight) / rangeDiff) * 100;
      pointerPos = Math.max(0, Math.min(100, pointerPos)); 
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold italic text-slate-900 uppercase">
              Think<span className="text-[#e22718]">Fit</span>_
            </h1>
            <p className="text-slate-500 text-sm italic">Chào {bodyInfo.userName}, mục tiêu Calo hôm nay đạt {progressPercent}%.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{bodyInfo.userName}</p>
              <p className="text-xs text-slate-500 italic">Backend Developer / N3 Japanese</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
               <i className="fa-solid fa-user text-slate-400"></i>
            </div>
          </div>
        </header>

        {/* HÀNG 1: THÔNG TIN TỔNG QUAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* CỘT 1: DINH DƯỠNG TRONG NGÀY */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center border-t-2 border-t-[#e22718] shadow-sm">
            <h3 className="text-[10px] font-bold mb-4 self-start uppercase tracking-[0.2em] text-slate-400">Daily_Nutrition</h3>
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100" strokeWidth="2" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-[#e22718] transition-all duration-1000" 
                  strokeWidth="2" 
                  strokeDasharray={`${Math.min(100, progressPercent)} 100`} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{remainingCalories > 0 ? remainingCalories.toLocaleString() : 0}</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Calo còn lại</span>
              </div>
            </div>
            
            <div className="w-full space-y-4">
              {macros.map((macro, index) => (
                <div key={index}>
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1 tracking-tighter">
                    <span className="text-slate-500">{macro.name}</span>
                    <span className={`text-${macro.color}-600`}>{Math.round(macro.current)}/{macro.target}g</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1">
                    <div className={`bg-${macro.color}-500 h-1 rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, (macro.current / macro.target) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT 2 & 3: CÂN NẶNG, AI INSIGHT & BIO-STATUS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Box Cân nặng & SMM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Cân nặng (kg)</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-slate-900">{bodyInfo.weight}</p>
                    {bodyInfo.weight > weightRange.maxWeight && <span className="text-xs text-orange-500 font-bold mb-1"><i className="fa-solid fa-arrow-trend-up"></i> Over</span>}
                </div>
                
                <div className="mt-5 h-1.5 bg-gray-200 rounded-full relative">
                  <div className="absolute left-[20%] right-[20%] h-full bg-green-500/20 border-x border-green-500/50"></div>
                  <div className="absolute top-[-4px] w-3.5 h-3.5 bg-[#e22718] rounded-full border-2 border-white shadow-md transition-all duration-1000" style={{ left: `calc(${pointerPos}% - 6px)` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-bold uppercase">
                  <span>{weightRange.minWeight}kg</span>
                  <span>{weightRange.maxWeight}kg</span>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 border-l-2 border-l-blue-500 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Khối lượng cơ (SMM)</p>
                <p className="text-3xl font-black text-slate-900">{bodyInfo.smm || "--"} <span className="text-sm font-normal text-slate-400">kg</span></p>
                <p className="text-[10px] text-blue-600 mt-2 font-bold uppercase italic">
                  Chỉ số BMI: {bodyInfo.bmi}
                </p>
              </div>
            </div>

            {/* 🚀 LƯỚI CHỨA AI INSIGHT VÀ TRẠNG THÁI CHẤN THƯƠNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AI Insight */}
              <div className="bg-red-50 border border-red-100 border-l-4 border-l-[#e22718] p-5 rounded-r-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <i className="fa-solid fa-robot text-[#e22718] mt-1 text-xs"></i>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-[#e22718] tracking-[0.2em] mb-1">System_Advisor_</h4>
                    <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
                      Dựa trên cân nặng {bodyInfo.weight}kg, mục tiêu calo lý tưởng của bạn là {nutrition.calories} kcal. 
                      {remainingCalories > 0 
                        ? ` Nạp thêm ${Math.round(remainingCalories)} calo nữa để đạt target.` 
                        : " Bạn đã vượt target calo. Xem xét thêm Cardio nhẹ."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🚀 THẺ TRẠNG THÁI CƠ/KHỚP (BIO-STATUS) */}
              <div className={`border p-5 rounded-lg shadow-sm flex flex-col justify-between ${activeInjuries.length > 0 ? 'bg-orange-50 border-orange-200 border-l-4 border-l-orange-500' : 'bg-emerald-50 border-emerald-200 border-l-4 border-l-emerald-500'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <i className={`fa-solid ${activeInjuries.length > 0 ? 'fa-triangle-exclamation text-orange-500' : 'fa-shield-heart text-emerald-500'}`}></i>
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeInjuries.length > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                      Bio_Status
                    </h4>
                  </div>
                  {/* Nút bấm chuyển sang trang phân tích sâu */}
                  <button 
                    onClick={() => navigate('/recoveryChart')}
                    className="text-[9px] font-bold uppercase text-slate-500 hover:text-slate-900 transition-colors underline decoration-dotted"
                  >
                    Xem chi tiết
                  </button>
                </div>

                <div className="mt-2">
                  {activeInjuries.length > 0 ? (
                    <div>
                      <p className="text-xs text-slate-700 font-medium mb-1">Cảnh báo: Đang trong quá trình phục hồi.</p>
                      <p className="text-[11px] text-slate-500 italic line-clamp-2">
                        Vị trí đau: {activeInjuries.map(i => `${i.injuryName?.split('(')[0].trim()} (Lv ${i.injuryScale})`).join(', ')}. Hãy ưu tiên tập nhẹ.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-700 font-medium mb-1">Cơ thể ở trạng thái tối ưu.</p>
                      <p className="text-[11px] text-slate-500 italic">Không phát hiện chấn thương nào. Sẵn sàng cho buổi tập cường độ cao.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* HÀNG 2: BIỂU ĐỒ RECHARTS */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-[10px] font-bold mb-6 uppercase tracking-[0.2em] text-slate-400 flex items-center">
             <i className="fa-solid fa-chart-column mr-2 text-blue-500"></i> Calorie_Flow_7_Days
          </h3>
          <div className="h-64 w-full">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '12px', color: '#0f172a'}} 
                  />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '10px', color: '#64748b'}} />
                  <Bar dataKey="in" name="Calo Nạp (In)" fill="#e22718" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="out" name="Calo Mục tiêu (Target)" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs italic">
                Chưa có dữ liệu 7 ngày gần nhất.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;