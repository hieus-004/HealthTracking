import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface BodyPartAPI {
  partId: number;
  partName: string;
}

interface MuscleGroupUI extends BodyPartAPI {
  lastTrained: string;
  statusColor: string;
  icon: string;
  volumeScore: number;
}

const MuscleTargeting: React.FC = () => {
  const navigate = useNavigate();
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        const response = await axiosClient.get<BodyPartAPI[]>('/bodyPart'); 
        let data = response.data; 

        // TẠM THỜI: MOCK DATA nếu API chưa trả về đủ 6 nhóm cơ
        if (!data || data.length < 6) {
          data = [
            { partId: 1, partName: 'Ngực' },
            { partId: 2, partName: 'Lưng' },
            { partId: 3, partName: 'Chân' },
            { partId: 4, partName: 'Vai' },
            { partId: 5, partName: 'Tay' }, // Nhóm cơ mới được tách
            { partId: 6, partName: 'Bụng' }
          ];
        }

        const mappedData: MuscleGroupUI[] = data.map((part) => {
          let icon = 'fa-dumbbell';
          let statusColor = 'text-slate-400';
          let lastTrained = 'Chưa có dữ liệu';
          let volumeScore = Math.floor(Math.random() * 40) + 40; // Random từ 40 - 80%

          const nameLower = part.partName.toLowerCase();
          if (nameLower.includes('ngực')) { icon = 'fa-shield-halved'; statusColor = 'text-emerald-500'; volumeScore = 85; }
          else if (nameLower.includes('lưng')) { icon = 'fa-dna'; statusColor = 'text-blue-500'; volumeScore = 70; }
          else if (nameLower.includes('chân')) { icon = 'fa-person-running'; statusColor = 'text-[#e22718]'; volumeScore = 40; } 
          else if (nameLower.includes('vai')) { icon = 'fa-child-reaching'; statusColor = 'text-orange-500'; volumeScore = 60; }
          else if (nameLower.includes('tay')) { icon = 'fa-hand-back-fist'; statusColor = 'text-indigo-500'; volumeScore = 75; lastTrained = 'Hôm qua'; } // Config riêng cho Tay
          else if (nameLower.includes('bụng')) { icon = 'fa-table-cells-large'; statusColor = 'text-emerald-500'; volumeScore = 90; }

          return { ...part, icon, statusColor, volumeScore, lastTrained };
        });

        setMuscleGroups(mappedData);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Lỗi Fetch Data:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBodyParts();
  }, []);

  const handleMuscleClick = (partId: number) => {
    navigate(`/exercises?muscleId=${partId}`);
  };

  // --- CẤU HÌNH BIỂU ĐỒ RADAR ---
  const radarData = {
    labels: muscleGroups.map(m => m.partName),
    datasets: [
      {
        label: 'Tần suất tập luyện (%)',
        data: muscleGroups.map(m => m.volumeScore),
        backgroundColor: 'rgba(226, 39, 24, 0.2)', // Đỏ mờ
        borderColor: '#e22718', // Đỏ đậm
        pointBackgroundColor: '#e22718',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#e22718',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        pointLabels: {
          font: { family: 'ui-sans-serif', size: 10, weight: 'bold' as const },
          color: '#64748b'
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-mono text-sm tracking-widest text-slate-400 uppercase">Đang tải cấu trúc giải phẫu...</div>;
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
              Muscle <span className="text-[#e22718]">Targeting_</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em]">
              Bản đồ giải phẫu và Phân tích khối lượng cơ bắp
            </p>
          </div>
          <button 
            onClick={() => navigate('/priority-config')} 
            className="px-6 py-2.5 bg-white shadow-sm border border-[#e22718] text-[#e22718] text-[10px] font-black uppercase rounded-lg hover:bg-[#e22718] hover:text-white transition-all tracking-widest flex items-center"
          >
            Vùng cơ ưu tiên <i className="fa-solid fa-star ml-2"></i>
          </button>
        </header>

        {/* MAIN LAYOUT: CHIA TỶ LỆ 1/3 VÀ 2/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI (4/12): BIỂU ĐỒ RADAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 h-full flex flex-col">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  <i className="fa-solid fa-crosshairs mr-2 text-[#e22718]"></i> Focus Heatmap
                </h3>
                <p className="text-[10px] text-slate-400 italic">Phân bổ khối lượng tập 30 ngày qua</p>
              </div>
              
              <div className="flex-grow flex items-center justify-center py-6">
                <div className="w-full h-[250px]">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </div>

              {/* Phân tích nhanh */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">AI Analysis</p>
                 <div className="flex items-start space-x-2">
                   <i className="fa-solid fa-circle-exclamation text-yellow-500 mt-0.5"></i>
                   <p className="text-xs text-slate-700 leading-relaxed font-medium">
                     Nhóm cơ <b>Chân</b> đang bị tụt lại phía sau. Gợi ý tăng thêm 2 bài tập vào lịch tuần này để cơ thể phát triển cân bằng.
                   </p>
                 </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (8/12): LƯỚI 6 CƠ BẮP HOÀN HẢO */}
          <div className="lg:col-span-8">
            {/* Lưới chia 2 cột màn vừa, 3 cột màn to -> Tạo ra ma trận 2x3 hoặc 3x2 tuyệt đẹp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {muscleGroups.map((muscle) => (
                <div 
                  key={muscle.partId} 
                  onClick={() => handleMuscleClick(muscle.partId)} 
                  className="bg-white shadow-sm border border-gray-200 p-5 rounded-xl cursor-pointer relative overflow-hidden group hover:border-[#e22718] hover:shadow-md transition-all flex flex-col justify-between min-h-[150px]"
                >
                  <div className="flex justify-between items-start relative z-10">
                    <h4 className="text-lg font-black uppercase italic text-slate-900 group-hover:text-[#e22718] transition-colors">
                      {muscle.partName}
                    </h4>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Last Trained</p>
                      <p className={`text-xs font-black ${muscle.statusColor}`}>{muscle.lastTrained}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-end relative z-10">
                    {/* Focus Score Bar */}
                    <div className="w-1/2">
                      <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">Volume Focus</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${muscle.volumeScore > 50 ? 'bg-slate-800' : 'bg-red-400'}`} style={{width: `${muscle.volumeScore}%`}}></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-600">{muscle.volumeScore}%</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300 group-hover:text-[#e22718] transition-colors flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
                      Chi tiết <i className="fa-solid fa-arrow-right ml-1.5"></i>
                    </span>
                  </div>

                  {/* Icon nền chìm tinh tế hơn */}
                  <i className={`fa-solid ${muscle.icon} absolute -right-3 -bottom-4 text-[80px] text-slate-50 group-hover:text-red-50 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500`}></i>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MuscleTargeting;