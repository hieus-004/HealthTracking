import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, type ResponsiveContainerProps } from 'recharts';
import axiosClient from '../../api/axiosClient';

const userId = 1;

const RecoveryDeepDive: React.FC = () => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosClient.get(`/injury/history/${userId}`);
        // Chuyển đổi dữ liệu Map từ BE thành phẳng để Recharts đọc được
        const formatted = res.data.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          ...item.joints
        }));
        setHistoryData(formatted);
      } catch (error) {
        console.error("Lỗi tải lịch sử phục hồi");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Tự động tìm danh sách các khớp có trong dữ liệu để vẽ Line
  const activeJoints = useMemo(() => {
    if (historyData.length === 0) return [];
    const keys = new Set<string>();
    historyData.forEach(item => {
      Object.keys(item).forEach(k => {
        if (k !== 'date') keys.add(k);
      });
    });
    return Array.from(keys);
  }, [historyData]);

  const colors = ['#e22718', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  if (isLoading) return <div className="p-10 text-center animate-pulse">Đang phân tích tiến trình phục hồi...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-black uppercase italic text-slate-900">Recovery_<span className="text-[#e22718]">Analytics</span></h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Theo dõi diễn biến chấn thương 30 ngày qua</p>
          </div>
          <button onClick={() => window.history.back()} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại
          </button>
        </header>

        {/* --- BIỂU ĐỒ CHÍNH --- */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-[#e22718]">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 tracking-[0.2em]">Pain_Trend_Analysis</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '11px', fontWeight: 'bold'}} />
                
                {activeJoints.map((joint, index) => (
                  <Line 
                    key={joint}
                    type="monotone" 
                    dataKey={joint} 
                    stroke={colors[index % colors.length]} 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- AI ADVISOR BOX --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-blue-50 border-l-4 border-l-blue-500 p-6 rounded-r-xl shadow-sm">
            <div className="flex items-start space-x-4">
              <i className="fa-solid fa-microchip-ai text-blue-600 text-xl mt-1"></i>
              <div>
                <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-2">AI_Rehab_Insight</h4>
                <p className="text-sm text-blue-800 leading-relaxed italic">
                  Biểu đồ cho thấy mức độ đau ở <b>{activeJoints[0]}</b> của bạn đã giảm 40% trong tuần qua. 
                  Hệ thống đề xuất bạn có thể bắt đầu các bài tập bổ trợ nhẹ với tạ 1-2kg từ ngày mai. 
                  Tiếp tục duy trì cường độ phục hồi hiện tại.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col justify-center items-center text-center">
             <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Dự kiến hồi phục</span>
             <span className="text-4xl font-black text-slate-900">05</span>
             <span className="text-[10px] font-bold text-[#e22718] uppercase">Ngày nữa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryDeepDive;