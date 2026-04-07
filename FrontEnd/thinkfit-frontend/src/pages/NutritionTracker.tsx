import React, { useState, useMemo, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

// --- 1. INTERFACES ---
interface DailyMacroResponse {
  cCalories: number; cProtein: number; cCarbs: number; cFat: number;
  calories: number; protein: number; carbs: number; fat: number;
}

interface Food {
  foodId: number; foodName: string; foodDesc: string;
  protein: number; carb: number; fat: number; calories: number;
  servingWeight: number; category: string;
}

interface FoodLog extends Food {
  logId: number; amount: number; unit: 'g' | 'portion';
}

const CATEGORY_ICONS: Record<string, string> = {
  "Protein": "fa-drumstick-bite", "Đạm": "fa-drumstick-bite",
  "Tinh bột": "fa-wheat-awn", "Carbs": "fa-wheat-awn",
  "Chất béo": "fa-oil-can", "Fats": "fa-oil-can",
  "Rau củ": "fa-leaf", "Veggies": "fa-leaf", "TPBS": "fa-pills"
};

const userId = 1;

const NutritionTracker: React.FC = () => {
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [apiData, setApiData] = useState<DailyMacroResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  // --- STATE CHO CHATBOT ---
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hệ thống ThinkFit AI đã sẵn sàng. Bạn cần tư vấn gì về dinh dưỡng hôm nay?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null); // Để tự động cuộn xuống

  // Tự động cuộn xuống khi có tin mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // --- HANDLER GỬI TIN NHẮN ---
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Gọi API chatbot của Hiếu
      const response = await axiosClient.post(`/nutri/chatbot/${userId}`, userMsg, {
        headers: { 'Content-Type': 'text/plain' } // Vì backend nhận String thuần
      });
      
      setChatMessages(prev => [...prev, { role: 'bot', text: response.data }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Lỗi kết nối Server. Vui lòng thử lại sau." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, macroRes] = await Promise.all([
          axiosClient.get<Food[]>('/food'),
          axiosClient.get<DailyMacroResponse>(`/nutri/todayMacro/${userId}`)
        ]);
        setAvailableFoods(foodRes.data);
        setApiData(macroRes.data);
      } catch (error) {
        console.error("Lỗi kết nối Lab:", error);
      } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  // --- 3. LOGIC TÍNH TOÁN (PHẢI THEO THỨ TỰ NÀY) ---

  // A. Hàm tính toán Macro lẻ
  const calculateMacros = (item: FoodLog) => {
    const totalGrams = item.unit === 'g' ? item.amount : item.amount * (item.servingWeight || 100);
    const factor = totalGrams / 100;
    return {
      calories: Math.round(item.calories * factor),
      protein: Math.round(item.protein * factor),
      carbs: Math.round(item.carb * factor),
      fat: Math.round(item.fat * factor),
    };
  };

  // B. Tổng hiện tại (Trong DB + Đang nháp)
  const grandTotals = useMemo(() => {
    const local = foodLogs.reduce((acc, item) => {
      const m = calculateMacros(item);
      return {
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return {
      calories: Math.round((apiData?.cCalories || 0) + local.calories),
      protein: Math.round((apiData?.cProtein || 0) + local.protein),
      carbs: Math.round((apiData?.cCarbs || 0) + local.carbs),
      fat: Math.round((apiData?.cFat || 0) + local.fat),
    };
  }, [foodLogs, apiData]);

  // C. Mục tiêu (Định nghĩa targets TRƯỚC suggestions)
  const targets = useMemo(() => ({
    calories: apiData?.calories || 2000,
    protein: apiData?.protein || 150,
    carbs: apiData?.carbs || 250,
    fat: apiData?.fat || 60
  }), [apiData]);

  // D. Gợi ý thông minh (Dựa trên grandTotals và targets)
  const suggestions = useMemo(() => {
    if (!apiData || availableFoods.length === 0) return [];
    const gaps = {
      p: targets.protein - grandTotals.protein,
      c: targets.carbs - grandTotals.carbs,
    };

    const suggestionsList: { food: Food; amountNeeded: number; reason: string }[] = [];
    if (gaps.p > 5) {
      const bestP = [...availableFoods].sort((a, b) => b.protein - a.protein)[0];
      if (bestP && bestP.protein > 0) {
        suggestionsList.push({ food: bestP, amountNeeded: Math.round((gaps.p / bestP.protein) * 100), reason: "để bù Đạm" });
      }
    }
    if (gaps.c > 10) {
      const bestC = [...availableFoods].sort((a, b) => b.carb - a.carb)[0];
      if (bestC && bestC.carb > 0) {
        suggestionsList.push({ food: bestC, amountNeeded: Math.round((gaps.c / bestC.carb) * 100), reason: "để bù Tinh bột" });
      }
    }
    return suggestionsList.slice(0, 2);
  }, [grandTotals, availableFoods, apiData, targets]);

  // --- 4. CATEGORIES & SEARCH ---
  const dynamicCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set(availableFoods.map(f => f.category).filter(Boolean)));
    return [
      { id: 'all', name: 'Tất cả', icon: 'fa-layer-group' },
      ...uniqueCats.map(cat => ({ id: cat, name: cat, icon: CATEGORY_ICONS[cat] || "fa-tag" }))
    ];
  }, [availableFoods]);

  const filteredLibrary = useMemo(() => {
    return availableFoods.filter(food => 
      food.foodName.toLowerCase().includes(searchQuery.toLowerCase()) && 
      (selectedCategory === 'all' || food.category === selectedCategory)
    );
  }, [searchQuery, selectedCategory, availableFoods]);

  // --- 5. HANDLERS ---
  const addFoodToLog = (food: Food, amount: number = 100) => {
    setFoodLogs([{ ...food, logId: Date.now(), amount, unit: 'g' }, ...foodLogs]);
  };

  if (isLoading || !apiData) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#e22718] font-black italic uppercase animate-pulse">Syncing_Food_Database...</div>;

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-[#e5e7eb] font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex justify-between items-end border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold uppercase italic text-white">Log <span className="text-[#e22718]">Nutrition_</span></h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sunday, April 05, 2026</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* FOOD LIBRARY */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 space-y-5 border-t-2 border-t-blue-500 shadow-xl">
              <h3 className="text-[10px] font-bold uppercase text-blue-500 tracking-widest italic">Live_Database_Access</h3>
              <input 
                type="text" placeholder="Gõ để tìm món ăn..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-[#444] text-white focus:border-blue-500 outline-none text-sm font-medium"
              />
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 custom-scrollbar scrollbar-hide items-center">
                {dynamicCategories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 w-auto min-w-max flex items-center space-x-2 px-4 py-1.5 rounded-md border transition-all duration-300
                    ${selectedCategory === cat.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40 translate-y-[-1px]' : 'bg-[#1a1a1a] border-[#333] text-gray-500 hover:text-gray-300'}`}>
                    <i className={`fa-solid ${cat.icon} text-[10px]`}></i>
                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{cat.name}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredLibrary.map(food => (
                  <div key={food.foodId} onClick={() => addFoodToLog(food)} className="p-3 bg-[#151515] border border-[#333] rounded flex justify-between items-center group cursor-pointer hover:border-[#e22718] transition-all">
                    <div>
                      <p className="text-xs font-bold text-gray-300 group-hover:text-white">{food.foodName}</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-tighter">{food.calories} kcal / 100g</p>
                    </div>
                    <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center group-hover:bg-[#e22718] text-white"><i className="fa-solid fa-plus text-[10px]"></i></div>
                  </div>
                ))}
              </div>
            </div>

            
            {/* PENDING SESSION LOGS */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden border-t-2 border-t-[#e22718]">
              <div className="p-4 border-b border-gray-800 bg-[#252525]/30">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#e22718]">Pending_Input_Session</h3>
              </div>
              <div className="divide-y divide-gray-800">
                {foodLogs.map((item) => {
                  const m = calculateMacros(item);
                  return (
                    <div key={item.logId} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 gap-4">
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-white">{item.foodName}</h4>
                        <div className="flex space-x-3 mt-1 font-mono text-[9px] uppercase text-gray-500">
                          <span className="text-blue-400">P: {m.protein}g</span><span className="text-green-400">C: {m.carbs}g</span><span className="text-yellow-400">F: {m.fat}g</span><span>({m.calories} kcal)</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex bg-[#1a1a1a] border border-[#444] rounded overflow-hidden h-8">
                          <input type="number" value={item.amount} onChange={(e) => setFoodLogs(foodLogs.map(l => l.logId === item.logId ? {...l, amount: parseFloat(e.target.value) || 0} : l))} className="w-16 bg-transparent text-xs text-center outline-none border-r border-[#444] text-white" />
                          <button onClick={() => setFoodLogs(foodLogs.map(l => l.logId === item.logId ? {...l, unit: l.unit === 'g' ? 'portion' : 'g'} : l))} className="px-2 text-[9px] font-black bg-gray-800 w-14">{item.unit === 'g' ? 'Gram' : 'Phần'}</button>
                        </div>
                        <button onClick={() => setFoodLogs(foodLogs.filter(l => l.logId !== item.logId))} className="text-gray-600 hover:text-[#e22718] p-2"><i className="fa-solid fa-trash-can text-xs"></i></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="space-y-6">
            <div className="bg-[#1e1e1e] border-l-4 border-l-blue-600 p-5 bg-blue-900/5 rounded-r-lg">
               <p className="text-[11px] text-gray-400 leading-relaxed italic">
                {grandTotals.protein < targets.protein 
                  ? `Hệ thống ghi nhận bạn cần thêm ${targets.protein - grandTotals.protein}g Protein để tối ưu hóa việc duy trì SMM.` 
                  : "Mục tiêu Đạm đã hoàn tất. Duy trì trạng thái này!"}
              </p>
            </div>
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 border-t-2 border-t-[#e22718] sticky top-6 shadow-2xl">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-6 tracking-widest italic font-mono">Macro_Summary_Analytic</h3>
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Projected Calories</p>
                  <p className="text-2xl font-black text-white">{grandTotals.calories.toLocaleString()} <span className="text-[10px] text-gray-600">/ {targets.calories.toLocaleString()} kcal</span></p>
                </div>
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#e22718] transition-all duration-1000" style={{ width: `${Math.min(100, (grandTotals.calories / targets.calories) * 100)}%` }}></div>
                </div>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Protein", current: grandTotals.protein, target: targets.protein, color: "bg-blue-500" },
                  { label: "Carbs", current: grandTotals.carbs, target: targets.carbs, color: "bg-green-500" },
                  { label: "Fat", current: grandTotals.fat, target: targets.fat, color: "bg-yellow-500" }
                ].map((macro) => (
                  <div key={macro.label}>
                    <div className="flex justify-between text-[9px] mb-1.5 uppercase font-bold"><span className="text-gray-500">{macro.label}</span><span className="text-white">{macro.current}g / {macro.target}g</span></div>
                    <div className="h-1 w-full bg-gray-900 rounded-full"><div className={`h-full ${macro.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (macro.current / macro.target) * 100)}%` }}></div></div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-[#e22718] hover:bg-red-700 text-white font-black text-[10px] rounded transition-all shadow-lg shadow-red-900/40 uppercase tracking-[0.2em]">Confirm_And_Sync_To_Server_</button>
            </div>
            
            {/* 🎯 SMART SUGGESTIONS - VERTICAL SCROLL VERSION */}
            {suggestions.length > 0 && (
              <div className="bg-[#1e1e1e] border-t-4 border-t-green-500 rounded-lg p-4 bg-green-950/10 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-green-500 text-[10px]"></i>
                    <h3 className="text-[10px] font-black uppercase text-green-500 tracking-widest italic">Smart_Macro_Calibration_</h3>
                  </div>
                </div>

                {/* CONTAINER CUỘN DỌC */}
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                  {suggestions.map((s, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center bg-[#151515] p-3 rounded border border-green-900/20 hover:border-green-500/50 transition-all duration-300 group"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-white">
                            <span className="text-green-400">+{s.amountNeeded}g</span> {s.food.foodName}
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-tighter">
                          Reason: <span className="text-gray-400 italic">{s.reason}</span>
                        </p>
                      </div>

                      <button 
                        onClick={() => addFoodToLog(s.food, s.amountNeeded)} 
                        className="flex-shrink-0 ml-4 px-4 py-1.5 bg-green-600/10 border border-green-600 text-green-500 text-[9px] font-black uppercase rounded hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        Deploy_
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hiệu ứng mờ ở đáy nếu có nhiều gợi ý hơn mức hiển thị */}
                {suggestions.length > 2 && (
                  <div className="h-4 bg-gradient-to-t from-[#1e1e1e] to-transparent mt-[-16px] pointer-events-none relative z-10"></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* --- 🚀 FLOATING AI TERMINAL ICON --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        
        {/* KHUNG CHAT (Chỉ hiện khi isChatOpen = true) */}
        {isChatOpen && (
          <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-3 border-b border-gray-800 bg-[#1a1a1a] flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Bio_Intelligence_Terminal</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <i className="fa-solid fa-minus"></i>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#121212] custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-[11px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#e22718] text-white rounded-br-none' 
                      : 'bg-[#1e1e1e] border border-[#333] text-gray-300 rounded-bl-none font-mono'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center space-x-2 text-[9px] text-gray-600 font-mono italic animate-pulse">
                  <i className="fa-solid fa-spinner fa-spin"></i> <span>Processing_Request...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-gray-800">
              <div className="relative">
                <input 
                  type="text" value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Enter command or ask AI..."
                  className="w-full bg-[#121212] border border-[#333] rounded-md px-4 py-2.5 text-xs text-white focus:border-[#e22718] outline-none pr-10 font-mono"
                />
                <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e22718]">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NÚT ICON CHAT NỔI */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isChatOpen ? 'bg-gray-800 rotate-90' : 'bg-[#e22718]'
          }`}
        >
          {isChatOpen ? (
            <i className="fa-solid fa-xmark text-white text-xl"></i>
          ) : (
            <div className="relative">
              <i className="fa-solid fa-robot text-white text-xl"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#e22718] rounded-full"></span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
  
};

export default NutritionTracker;