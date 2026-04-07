import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import axios from 'axios';

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface DailyWorkout {
  day: string;
  focus: string;
  status: 'work' | 'rest';
  intensity: string;
}

interface BodyPartAPI {
  partId: number;
  partName: string;
}

// Interface mở rộng cho UI (để giữ lại icon và màu sắc hiển thị)
interface MuscleGroupUI extends BodyPartAPI {
  lastTrained: string;
  statusColor: string;
  icon: string;
  isWide?: boolean;
}

const MuscleTargeting: React.FC = () => {
  const navigate = useNavigate();

  // STATE MỚI ĐỂ LƯU DỮ LIỆU TỪ API
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. STATE (Đã xóa state injury vì dữ liệu này sẽ được lấy từ DB/AI sau khi quét xong)
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Wed', 'Fri', 'Sat']);

  // GỌI API KHI COMPONENT MOUNT
  useEffect(() => {
  const fetchBodyParts = async () => {
    try {
      // CÁCH 2: Ép kiểu dữ liệu ngay tại hàm GET của Axios
      // <BodyPartAPI[]> bảo TS rằng: "Dữ liệu trả về chắc chắn là mảng BodyPartAPI"
      const response = await axiosClient.get<BodyPartAPI[]>('/bodyPart'); 
      
      // Lúc này TS tự hiểu 'data' là BodyPartAPI[]
      const data = response.data; 

      // Vì 'data' đã có kiểu rõ ràng, nên 'part' ở đây tự động được hiểu là BodyPartAPI
      // Ông không cần viết (part: BodyPartAPI) nữa, dấu gạch đỏ sẽ biến mất
      const mappedData: MuscleGroupUI[] = data.map((part) => {
        let icon = 'fa-dumbbell';
        let statusColor = 'text-gray-600';
        let isWide = false;
        let lastTrained = 'Chưa có dữ liệu';

        const nameLower = part.partName.toLowerCase();
        if (nameLower.includes('ngực')) { icon = 'fa-shield-halved'; statusColor = 'text-green-500'; }
        else if (nameLower.includes('lưng')) { icon = 'fa-dna'; statusColor = 'text-gray-600'; }
        else if (nameLower.includes('chân')) { icon = 'fa-person-running'; statusColor = 'text-red-500'; }
        else if (nameLower.includes('vai')) { icon = 'fa-hand-fist'; }
        else if (nameLower.includes('bụng')) { icon = 'fa-rug'; isWide = true; statusColor = 'text-green-500'; }

        return { ...part, icon, statusColor, isWide, lastTrained };
      });

      setMuscleGroups(mappedData);
    } catch (error: unknown) {
      // Xử lý lỗi 'unknown' bằng cách kiểm tra Axios Error
      if (axios.isAxiosError(error)) {
        // Giờ TS biết 'error' là AxiosError, ông có thể truy cập các thuộc tính thoải mái
        const message = error.response?.data?.message || error.message;
        console.error("Lỗi Lab Terminal:", message);
      } else {
        console.error("Lỗi hệ thống không xác định:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchBodyParts();
}, []);

  // Sửa lại hàm chuyển trang để dùng partId từ DB thay vì string id cứng
  const handleMuscleClick = (partId: number) => {
    navigate(`/exercises?muscleId=${partId}`)
  }

  // MOCK DATA: Lịch tập (Sau này sẽ Generate từ AI/Backend)
  const weeklySchedule: DailyWorkout[] = [
    { day: 'Mon', focus: 'Chest & Triceps', status: 'work', intensity: 'High' },
    { day: 'Tue', focus: 'Rest Day', status: 'rest', intensity: '-' },
    { day: 'Wed', focus: 'Back & Biceps', status: 'work', intensity: 'Moderate' },
    { day: 'Thu', focus: 'Rest Day', status: 'rest', intensity: '-' },
    { day: 'Fri', focus: 'Legs & Abs', status: 'work', intensity: 'Max' },
    { day: 'Sat', focus: 'Shoulders & Arms', status: 'work', intensity: 'Moderate' },
    { day: 'Sun', focus: 'Active Recovery', status: 'rest', intensity: 'Low' },
  ];


  return (
    <div className="min-h-screen p-6 bg-[#121212] text-[#e5e7eb] font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP HEADER */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">
              Muscle <span className="text-[#e22718]">Targeting_</span>
            </h1>
          </div>
          <button onClick={() => navigate('/priority-config')} className="px-6 py-2 bg-[#1e1e1e] border border-[#e22718] text-[#e22718] text-[10px] font-black uppercase rounded hover:bg-[#e22718] hover:text-white transition-all tracking-widest">
            Vùng cơ ưu tiên <i className="fa-solid fa-star ml-2"></i>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: OPS CENTER */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 🎯 TÍCH HỢP TRANG SCAN CHẤN THƯƠNG Ở ĐÂY */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 border-t-2 border-t-[#e22718] flex flex-col h-[180px]">
              <div>
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                  <i className="fa-solid fa-street-view mr-2 text-[#e22718]"></i> Bio-Mechanical_Scanner
                </h3>
                <p className="text-[10px] text-gray-500 italic mb-4 leading-relaxed">
                  Cập nhật hồ sơ chấn thương qua mô hình 3D. AI sẽ dựa vào đây để thiết lập lịch tập an toàn.
                </p>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={() => navigate('/bodyDiag')} 
                  className="w-full py-3 bg-red-950/30 border border-[#e22718] text-[#e22718] font-black text-[10px] uppercase tracking-[0.2em] rounded hover:bg-[#e22718] hover:text-white transition-all group flex items-center justify-center"
                >
                  <i className="fa-solid fa-expand mr-3 group-hover:animate-ping"></i> Khởi_Động_Máy_Quét_
                </button>
              </div>
            </div>

            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5">
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-widest">
                <i className="fa-solid fa-calendar-days mr-2 text-blue-500"></i> Weekly_Availability
              </h3>
              <div className="flex justify-between gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button key={day} onClick={() => setAvailableDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                    className={`flex-1 py-3 text-[10px] font-black rounded border transition-all ${availableDays.includes(day) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#151515] border-[#333] text-gray-600'}`}>
                    {day[0]}
                  </button>
                ))}
              </div>
              <button className="w-full mt-6 py-4 bg-white text-black text-[11px] font-black uppercase rounded hover:bg-[#e22718] hover:text-white transition-all tracking-[0.2em]">
                Generate_Workout_Plan <i className="fa-solid fa-bolt-lightning ml-3"></i>
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: MUSCLE GRID */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {muscleGroups.map((muscle) => (
              <div key={muscle.partId} onClick={() => handleMuscleClick(muscle.partId)} className={`bg-[#1e1e1e] border border-[#333] p-5 rounded-lg cursor-pointer relative overflow-hidden group hover:border-[#e22718] transition-all ${muscle.isWide ? 'md:col-span-2' : ''}`}>
                <div className="flex justify-between items-start relative z-10">
                  <h4 className="text-lg font-black uppercase italic text-white group-hover:text-[#e22718]">{muscle.partName}</h4>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-600 uppercase font-bold">Last Trained</p>
                    <p className={`text-xs font-black ${muscle.statusColor}`}>{muscle.lastTrained}</p>
                  </div>
                </div>
                <i className={`fa-solid ${muscle.icon} absolute -right-4 -bottom-4 text-7xl text-white/5 group-hover:text-[#e22718]/10`}></i>
              </div>
            ))}
          </div>
        </div>

        {/* --- BẢNG LỊCH TẬP CHI TIẾT --- */}
        <section className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-gray-800 bg-[#1a1a1a] flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">
              <i className="fa-solid fa-microchip mr-3 text-[#e22718]"></i> Training_Deployment_Schedule_v2.0
            </h3>
            <span className="text-[9px] font-mono text-gray-600 uppercase">Status: Computed_By_AI_Agent</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-800">
            {weeklySchedule.map((item) => (
              <div key={item.day} className={`p-5 flex flex-col h-full transition-all hover:bg-white/[0.02] ${item.status === 'rest' ? 'opacity-40 bg-black/20' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-black uppercase ${item.status === 'work' ? 'text-[#e22718]' : 'text-gray-600'}`}>
                    {item.day}
                  </span>
                  {item.status === 'work' && <span className="w-1.5 h-1.5 rounded-full bg-[#e22718] animate-pulse"></span>}
                </div>
                
                <div className="flex-grow">
                  <p className={`text-[10px] font-bold leading-tight uppercase ${item.status === 'work' ? 'text-white' : 'text-gray-700'}`}>
                    {item.focus}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800/50">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter">
                    <span className="text-gray-600">Intensity</span>
                    <span className={item.intensity === 'Max' ? 'text-orange-500' : 'text-gray-400'}>{item.intensity}</span>
                  </div>
                  <div className="mt-1 h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${item.status === 'work' ? 'bg-[#e22718]' : 'bg-gray-800'}`} 
                      style={{ width: item.intensity === 'Max' ? '100%' : item.intensity === 'Moderate' ? '60%' : '20%' }}>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default MuscleTargeting;