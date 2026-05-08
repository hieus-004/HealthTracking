import React, { useState, useMemo, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';

// --- 1. INTERFACES ---
interface DailyMacroResponse {
  macroId?: number; // CẦN CÓ macroId ĐỂ BIẾT LÀ DÙNG PUT HAY POST
  cCalories: number; cProtein: number; cCarbs: number; cFat: number;
  calories: number; protein: number; carbs: number; fat: number;
}

interface Food {
  foodId: number; foodName: string; foodDesc: string;
  protein: number; carb: number; fat: number; calories: number;
  servingWeight: number; category: string;
}

interface FoodLog extends Food {
  logId: number;
  amount: number | string;
  unit: 'g' | 'portion';
  meal: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Protein": "fa-drumstick-bite", "Đạm": "fa-drumstick-bite",
  "Tinh bột": "fa-wheat-awn", "Carbs": "fa-wheat-awn",
  "Chất béo": "fa-oil-can", "Fats": "fa-oil-can",
  "Rau củ": "fa-leaf", "Veggies": "fa-leaf", "TPBS": "fa-pills"
};

const MEAL_OPTIONS = [
  { id: 'Sáng', icon: 'fa-sun', color: 'text-yellow-500' },
  { id: 'Trưa', icon: 'fa-cloud-sun', color: 'text-orange-500' },
  { id: 'Tối', icon: 'fa-moon', color: 'text-blue-500' },
  { id: 'Phụ', icon: 'fa-apple-whole', color: 'text-green-500' }
];

const userId = 1;

// --- 🚀 COMPONENT CON: THẺ HIỂN THỊ MÓN ĂN ---
interface FoodLogItemProps {
  item: FoodLog;
  macros: { calories: number; protein: number; carbs: number; fat: number };
  onEdit: (item: FoodLog) => void;
  onRemove: (logId: number) => void;
}

const FoodLogItem: React.FC<FoodLogItemProps> = ({ item, macros, onEdit, onRemove }) => {
  return (
    <div
      onClick={() => onEdit(item)}
      className="p-4 flex flex-col md:flex-row md:items-center justify-between bg-white border-b border-gray-100 hover:bg-blue-50/50 gap-4 transition-colors cursor-pointer group border-l-2 border-l-transparent hover:border-l-blue-500"
    >
      <div className="w-full md:w-1/3 flex flex-col items-start justify-center">
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {item.foodName}
        </h4>
        <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-slate-500 font-bold uppercase tracking-widest shadow-sm">
          {item.meal}
        </span>
      </div>

      <div className="w-full md:w-1/3 flex justify-start md:justify-center items-center space-x-6">
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Pro</span>
          <span className="text-xs font-bold text-blue-600">{macros.protein}g</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Carb</span>
          <span className="text-xs font-bold text-green-600">{macros.carbs}g</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Fat</span>
          <span className="text-xs font-bold text-yellow-600">{macros.fat}g</span>
        </div>
        <div className="flex flex-col items-center border-l border-gray-200 pl-6 ml-2">
          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Kcal</span>
          <span className="text-sm font-black text-slate-700">{macros.calories}</span>
        </div>
      </div>

      <div className="w-full md:w-1/3 flex items-center justify-between md:justify-end space-x-4 mt-2 md:mt-0">
        <div className="flex items-baseline gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 group-hover:bg-white group-hover:border-blue-200 transition-colors">
          <span className="text-sm font-black text-slate-800">{item.amount}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase">{item.unit === 'g' ? 'g' : 'Phần'}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.logId);
          }}
          className="text-slate-400 hover:text-[#e22718] p-2 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
          title="Xóa món này"
        >
          <i className="fa-solid fa-trash-can text-sm"></i>
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const NutritionTracker: React.FC = () => {
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [apiData, setApiData] = useState<DailyMacroResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);

  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isEditingDate, setIsEditingDate] = useState<boolean>(false); 

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [modalAmount, setModalAmount] = useState<number | string>(100);
  const [modalUnit, setModalUnit] = useState<'g' | 'portion'>('g');
  const [modalMeal, setModalMeal] = useState<string>('Sáng');

  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hệ thống ThinkFit AI đã sẵn sàng. Bạn cần tư vấn gì về dinh dưỡng hôm nay?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const changeDate = (days: number) => {
    const dateObj = new Date(currentDate);
    dateObj.setDate(dateObj.getDate() + days);
    setCurrentDate(dateObj.toISOString().split('T')[0]);
  };

  const refreshData = async () => {
    try {
      const [foodRes, macroRes, logsRes] = await Promise.all([
        axiosClient.get<Food[]>('/food'),
        axiosClient.get<DailyMacroResponse>(`/nutri/todayMacro/${userId}`, { params: { date: currentDate } }),
        axiosClient.get<any[]>(`/nutri/todayLogs/${userId}`, { params: { date: currentDate } })
      ]);

      const foodsList = foodRes.data;
      const rawLogs = logsRes.data;

      const populatedLogs: FoodLog[] = rawLogs.map(rawLog => {
        const foodDetail = foodsList.find(f => String(f.foodId) === String(rawLog.foodId));
        return {
          ...(foodDetail || {}),
          foodId: rawLog.foodId,
          foodName: foodDetail?.foodName || "Món ăn bị ẩn",
          logId: rawLog.mealId,
          amount: rawLog.amount,
          meal: rawLog.mealTime,
          unit: rawLog.unit || 'g'
        } as FoodLog;
      });

      setAvailableFoods(foodsList);
      setApiData(macroRes.data);
      setFoodLogs(populatedLogs);
      setLastSyncedTime(new Date());
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentDate]);

  const confirmAddOrEditFood = async () => {
    if (!selectedFood) return;
    setIsSyncing(true);
    const finalAmount = modalAmount === '' ? 0 : Number(modalAmount);

    try {
      if (editingLogId) {
        await axiosClient.put(`/nutri/log/${editingLogId}`, {
          amount: finalAmount,
          unit: modalUnit,
          mealTime: modalMeal
        });
      } else {
        await axiosClient.post(`/nutri/log`, {
          userId: userId,
          foodId: selectedFood.foodId,
          amount: finalAmount,
          unit: modalUnit,
          mealTime: modalMeal,
          date: currentDate
        });
      }
      await refreshData();
    } catch (error) {
      alert("Lỗi khi đồng bộ với máy chủ. Vui lòng thử lại!");
      setIsSyncing(false);
    } finally {
      closeModal();
    }
  };

  const removeFoodLog = async (idToRemove: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa món này khỏi nhật ký?")) return;
    setIsSyncing(true);
    try {
      await axiosClient.delete(`/nutri/log/${idToRemove}`);
      await refreshData();
    } catch (error) {
      alert("Xóa thất bại. Không thể kết nối với máy chủ!");
      setIsSyncing(false);
    }
  };

  const calculateMacros = (item: Partial<FoodLog>) => {
    const safeAmount = item.amount === '' || item.amount === undefined ? 0 : Number(item.amount);
    const cals = item.calories || 0;
    const pro = item.protein || 0;
    const carb = item.carb || 0;
    const fat = item.fat || 0;
    const servingW = item.servingWeight || 100;

    const totalGrams = item.unit === 'g' ? safeAmount : safeAmount * servingW;
    const factor = totalGrams / 100;

    return {
      calories: Math.round(cals * factor),
      protein: Math.round(pro * factor),
      carbs: Math.round(carb * factor),
      fat: Math.round(fat * factor),
    };
  };

  const grandTotals = useMemo(() => {
    return foodLogs.reduce((acc, item) => {
      const m = calculateMacros(item);
      return {
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [foodLogs]);

  // ==========================================
  // 🚀 4. GỌI API CẬP NHẬT DAILY MACRO LÊN SERVER (Giao cho BE xử lý Upsert)
  // ==========================================
  useEffect(() => {
    if (isLoading || !apiData) return;
    if (foodLogs.length === 0 && grandTotals.calories === 0 && apiData.cCalories === 0) return;

    setIsSyncing(true);

    const macroSyncTimer = setTimeout(async () => {
      try {
        // GỌI 1 API POST DUY NHẤT. BACKEND SẼ TỰ BIẾT PHẢI INSERT HAY UPDATE
        await axiosClient.post(`/dailyMacro?date=${currentDate}`, {
          userId: userId, 
          date: currentDate, 
          tKcal: targets.calories,
          tProtein: targets.protein,
          tCarb: targets.carbs,
          tFat: targets.fat,
          cKcal: grandTotals.calories,
          cProtein: grandTotals.protein,
          cCarb: grandTotals.carbs,
          cFat: grandTotals.fat
        });
        
        console.log(`Đã đồng bộ tổng Macro của ngày ${currentDate} lên server!`);
        setLastSyncedTime(new Date());
      } catch (error) {
        console.error("Lỗi khi cập nhật Daily Macro:", error);
      } finally {
        setIsSyncing(false);
      }
    }, 1500); 

    return () => clearTimeout(macroSyncTimer);
    
  }, [grandTotals.calories, grandTotals.protein, grandTotals.carbs, grandTotals.fat, currentDate]);
  // Xóa apiData?.macroId khỏi array dependency ở trên vì ta ko cần nó quyết định PUT hay POST nữa

  const groupedLogs = useMemo(() => {
    const groups: Record<string, FoodLog[]> = {
      'Sáng': [], 'Trưa': [], 'Tối': [], 'Phụ': []
    };
    foodLogs.forEach(log => {
      if (groups[log.meal]) {
        groups[log.meal].push(log);
      } else {
        groups['Phụ'].push(log);
      }
    });
    return groups;
  }, [foodLogs]);

  const targets = useMemo(() => ({
    calories: apiData?.calories || 2000,
    protein: apiData?.protein || 150,
    carbs: apiData?.carbs || 250,
    fat: apiData?.fat || 60
  }), [apiData]);

  const dynamicCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set(availableFoods.map(f => f.category).filter(Boolean)));
    return [
      { id: 'all', name: 'Tất cả', icon: 'fa-layer-group' },
      ...uniqueCats.map(cat => ({ id: cat, name: cat, icon: CATEGORY_ICONS[cat] || "fa-tag" }))
    ];
  }, [availableFoods]);

  const filteredLibrary = useMemo(() => {
    return availableFoods.filter(food =>
      food.foodName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || food.category === selectedCategory)
    );
  }, [searchQuery, selectedCategory, availableFoods]);

  const openAddModal = (food: Food) => {
    setSelectedFood(food);
    setEditingLogId(null);
    setModalAmount(100);
    setModalUnit('g');
    setModalMeal('Sáng');
  };

  const openEditModal = (logItem: FoodLog) => {
    setSelectedFood(logItem);
    setEditingLogId(logItem.logId);
    setModalAmount(logItem.amount);
    setModalUnit(logItem.unit);
    setModalMeal(logItem.meal);
  };

  const closeModal = () => {
    setSelectedFood(null);
    setEditingLogId(null);
  }

  const handleChatSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);
    try {
      const response = await axiosClient.post(`/nutri/chatbot/${userId}`, userMsg, { headers: { 'Content-Type': 'text/plain' } });
      setChatMessages(prev => [...prev, { role: 'bot', text: response.data }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Lỗi kết nối Server." }]);
    } finally { setIsChatLoading(false); }
  };

  const modalMacros = selectedFood ? calculateMacros({
    ...selectedFood,
    amount: modalAmount === '' ? 0 : Number(modalAmount),
    unit: modalUnit
  }) : null;

  const calPercentage = Math.min(100, (grandTotals.calories / targets.calories) * 100);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercentage / 100) * circumference;

  if (isLoading || !apiData) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#e22718] font-black italic uppercase animate-pulse">Đang tải cấu hình máy chủ...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-slate-800 font-sans relative">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- HEADER --- */}
        <header className="flex justify-between items-end border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold uppercase italic text-slate-900">Log <span className="text-[#e22718]">Nutrition_</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* FOOD LIBRARY */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5 border-t-2 border-t-blue-500 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase text-blue-500 tracking-widest italic">Live_Database_Access</h3>
              <input
                type="text" placeholder="Gõ để tìm món ăn..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-slate-800 focus:border-blue-500 outline-none text-sm font-medium"
              />
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 custom-scrollbar scrollbar-hide items-center">
                {dynamicCategories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 w-auto min-w-max flex items-center space-x-2 px-4 py-1.5 rounded-md border transition-all duration-300
                    ${selectedCategory === cat.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md translate-y-[-1px]'
                        : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}>
                    <i className={`fa-solid ${cat.icon} text-[10px]`}></i>
                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{cat.name}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredLibrary.map(food => (
                  <div key={food.foodId} onClick={() => openAddModal(food)} className="p-3 bg-white border border-gray-200 rounded flex justify-between items-center group cursor-pointer hover:border-[#e22718] hover:shadow-sm transition-all">
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#e22718] transition-colors">{food.foodName}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{food.calories} kcal / 100g</p>
                    </div>
                    <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center group-hover:bg-[#e22718] text-slate-500 group-hover:text-white transition-colors">
                      <i className="fa-solid fa-plus text-[10px]"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PENDING SESSION LOGS - Đã chia theo bữa */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden border-t-2 border-t-[#e22718] shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#e22718]">Daily_Log_Timeline</h3>

                <div className="flex items-center space-x-2 text-[10px] font-mono">
                  {isSyncing ? (
                    <span className="text-slate-500 italic animate-pulse">
                      <i className="fa-solid fa-arrows-rotate fa-spin mr-1"></i> Đang đồng bộ...
                    </span>
                  ) : (
                    <span className="text-emerald-600">
                      <i className="fa-solid fa-cloud-check mr-1"></i>
                      {lastSyncedTime ? `Đã lưu lúc ${lastSyncedTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Đã đồng bộ'}
                    </span>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {MEAL_OPTIONS.map((mealType) => {
                  const logsInMeal = groupedLogs[mealType.id];

                  return (
                    <div key={mealType.id} className="bg-white">
                      <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                          <i className={`fa-solid ${mealType.icon} ${mealType.color} text-xs`}></i>
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            Bữa {mealType.id}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {logsInMeal.length} món
                        </span>
                      </div>

                      <div className="divide-y divide-gray-50">
                        {logsInMeal.length > 0 ? (
                          logsInMeal.map((item) => (
                            <FoodLogItem
                              key={item.logId}
                              item={item}
                              macros={calculateMacros(item)}
                              onEdit={openEditModal}
                              onRemove={removeFoodLog}
                            />
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-[9px] text-slate-300 italic uppercase tracking-tighter">Chưa có dữ liệu bữa {mealType.id.toLowerCase()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-l-blue-600 p-5 rounded-r-lg">
              <p className="text-[11px] text-blue-800 leading-relaxed italic">
                {grandTotals.protein < targets.protein
                  ? `Hệ thống ghi nhận bạn cần thêm ${targets.protein - grandTotals.protein}g Protein để tối ưu hóa việc duy trì SMM.`
                  : "Mục tiêu Đạm đã hoàn tất. Duy trì trạng thái này!"}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 border-t-2 border-t-[#e22718] sticky top-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-widest italic font-mono text-center">Macro_Summary_Analytic</h3>

              {/* --- 🚀 DATE STEPPER XỊN XÒ VỚI TÍNH NĂNG CLICK-TO-EDIT LỊCH --- */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-8 border border-gray-200">
                <button onClick={() => changeDate(-1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-500 transition-all border border-transparent hover:border-gray-200">
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>

                <div className="flex flex-col items-center justify-center min-w-[140px] h-10">
                  {isEditingDate ? (
                    <input
                      type="date"
                      value={currentDate}
                      autoFocus
                      onBlur={() => setIsEditingDate(false)}
                      onChange={(e) => {
                        setCurrentDate(e.target.value);
                        setIsEditingDate(false);
                      }}
                      className="bg-white border border-blue-400 rounded text-xs font-bold text-slate-800 outline-none px-2 py-1.5 shadow-sm w-full text-center"
                    />
                  ) : (
                    <div
                      onClick={() => setIsEditingDate(true)}
                      className="flex flex-col items-center group cursor-pointer w-full"
                      title="Nhấn để chọn ngày"
                    >
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                        Ngày ghi nhận <i className="fa-regular fa-calendar"></i>
                      </span>
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {new Date(currentDate).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                <button onClick={() => changeDate(1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-500 transition-all border border-transparent hover:border-gray-200">
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>

              {/* VÒNG TRÒN MACRO (CIRCULAR RING) */}
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <circle
                    cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent"
                    className="text-[#e22718] transition-all duration-1000 ease-out"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">{grandTotals.calories.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">/ {targets.calories.toLocaleString()} kcal</span>
                </div>
              </div>

              {/* THANH MACRO TUYẾN TÍNH CỦA P/C/F */}
              <div className="space-y-5">
                {[
                  { label: "Protein", current: grandTotals.protein, target: targets.protein, color: "bg-blue-500" },
                  { label: "Carbs", current: grandTotals.carbs, target: targets.carbs, color: "bg-green-500" },
                  { label: "Fat", current: grandTotals.fat, target: targets.fat, color: "bg-yellow-500" }
                ].map((macro) => (
                  <div key={macro.label}>
                    <div className="flex justify-between text-[9px] mb-1.5 uppercase font-bold"><span className="text-slate-500">{macro.label}</span><span className="text-slate-900">{macro.current}g / {macro.target}g</span></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${macro.color} transition-all duration-1000`} style={{ width: `${Math.min(100, (macro.current / macro.target) * 100)}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🚀 MODAL OVERLAY: THÊM / SỬA THỰC PHẨM --- */}
      {selectedFood && modalMacros && (
        <div className="fixed inset-0 z-[150] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            <div className="bg-gray-50 border-b border-gray-200 p-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">{selectedFood.foodName}</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                  {editingLogId ? 'Chỉnh sửa thông tin bữa ăn' : 'Config Data Entry'}
                </p>
              </div>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-900 hover:bg-gray-100 bg-white p-2 rounded-full border border-gray-200 transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Định lượng</label>
                  <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden h-12 focus-within:border-blue-500 transition-colors">
                    <button onClick={() => setModalAmount(Math.max(0, Number(modalAmount) - (modalUnit === 'g' ? 10 : 1)))} className="px-4 text-slate-500 hover:text-slate-900 hover:bg-gray-50 border-r border-gray-300 transition-colors shrink-0"><i className="fa-solid fa-minus"></i></button>
                    <input type="number" value={modalAmount} onChange={(e) => setModalAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} className="flex-grow min-w-0 bg-transparent text-lg font-bold text-center outline-none text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button onClick={() => setModalAmount(Number(modalAmount) + (modalUnit === 'g' ? 10 : 1))} className="px-4 text-slate-500 hover:text-slate-900 hover:bg-gray-50 border-l border-gray-300 transition-colors shrink-0"><i className="fa-solid fa-plus"></i></button>
                    <div className="flex w-32 shrink-0 bg-gray-100">
                      <button onClick={() => setModalUnit('g')} className={`flex-1 text-[10px] font-black uppercase transition-colors ${modalUnit === 'g' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-gray-200'}`}>Gram</button>
                      <button onClick={() => setModalUnit('portion')} className={`flex-1 text-[10px] font-black uppercase transition-colors ${modalUnit === 'portion' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-gray-200'}`}>Phần</button>
                    </div>
                  </div>
                  {modalUnit === 'portion' && <p className="text-[9px] text-slate-500 italic mt-1 text-right">1 Phần = {selectedFood.servingWeight}g</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Bữa ăn</label>
                  <div className="grid grid-cols-4 gap-2">
                    {MEAL_OPTIONS.map(meal => (
                      <button key={meal.id} onClick={() => setModalMeal(meal.id)} className={`py-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${modalMeal === meal.id ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}>
                        <i className={`fa-solid ${meal.icon} text-lg ${modalMeal === meal.id ? meal.color : 'text-slate-400'}`}></i>
                        <span className="text-[10px] font-bold">{meal.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col justify-center relative">
                <h3 className="text-[10px] absolute top-4 left-4 font-bold uppercase text-slate-500 tracking-widest"><i className="fa-solid fa-chart-pie mr-2"></i>Macro Preview</h3>
                <div className="text-center mt-6 mb-6">
                  <span className="text-4xl font-black text-slate-900">{modalMacros.calories}</span><span className="text-[10px] text-slate-500 uppercase ml-1">Kcal</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Protein', value: modalMacros.protein, color: 'bg-blue-500', max: targets.protein },
                    { label: 'Carbs', value: modalMacros.carbs, color: 'bg-green-500', max: targets.carbs },
                    { label: 'Fat', value: modalMacros.fat, color: 'bg-yellow-500', max: targets.fat }
                  ].map(macro => (
                    <div key={macro.label}>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1"><span className="text-slate-500">{macro.label}</span><span className="text-slate-900">{macro.value}g</span></div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                        <div className={`h-full ${macro.color} rounded-full transition-all duration-300`} style={{ width: `${Math.min(100, (macro.value / macro.max) * 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button onClick={closeModal} className="px-6 py-2.5 rounded text-[10px] font-bold uppercase text-slate-500 hover:bg-gray-200 transition-colors">Hủy</button>

              <button onClick={confirmAddOrEditFood} className={`px-6 py-2.5 rounded text-[10px] font-black uppercase text-white transition-all flex items-center shadow-md ${editingLogId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-[#e22718] hover:bg-red-700 shadow-red-500/30'}`}>
                <i className={`fa-solid ${editingLogId ? 'fa-floppy-disk' : 'fa-check'} mr-2`}></i>
                {editingLogId ? 'Cập nhật thay đổi' : 'Xác nhận & Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 🚀 FLOATING AI TERMINAL ICON --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Bio_Intelligence_Terminal</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors"><i className="fa-solid fa-minus"></i></button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-[11px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#e22718] text-white rounded-br-none' : 'bg-white border border-gray-200 text-slate-700 rounded-bl-none font-sans'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center space-x-2 text-[9px] text-slate-500 font-mono italic animate-pulse"><i className="fa-solid fa-spinner fa-spin"></i> <span>Processing_Request...</span></div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="relative">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSendMessage()} placeholder="Enter command or ask AI..." className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5 text-xs text-slate-900 focus:border-[#e22718] outline-none pr-10" />
                <button onClick={handleChatSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#e22718]"><i className="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        )}
        
        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${isChatOpen ? 'bg-slate-800 rotate-90' : 'bg-[#e22718]'}`}>
          {isChatOpen ? <i className="fa-solid fa-xmark text-white text-xl"></i> : <div className="relative"><i className="fa-solid fa-robot text-white text-xl"></i><span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span></div>}
        </button>
      </div>
    </div>
  );
};

export default NutritionTracker;