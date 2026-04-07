import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient'; // Giả sử Hiếu đã tạo axiosClient
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- 1. INTERFACE KHỚP VỚI BACKEND DTO ---
interface BodyEvolutionResponse {
  id: number;
  weight: number;
  bodyfatPerc: number;
  smm: number;
  timestamp: string; // ISO string từ OffsetDateTime
}

const userId = 1; // Giả lập User ID

const BodyEvolution: React.FC = () => {
  const [history, setHistory] = useState<BodyEvolutionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. GỌI API LẤY LỊCH SỬ
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Gọi đến endpoint chúng ta đã thiết kế ở BodyController
        const response = await axiosClient.get<BodyEvolutionResponse[]>(`user/${userId}/body-evolution`);
        // Backend trả về ASC (cũ -> mới), rất tiện cho biểu đồ
        setHistory(response.data);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử tiến hóa:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 3. LOGIC TÍNH TOÁN TRENDS (Biến thiên)
  const calculateTrend = (key: keyof BodyEvolutionResponse) => {
    if (history.length < 2) return { value: "0", isDown: false };
    const first = history[0][key] as number;
    const last = history[history.length - 1][key] as number;
    const diff = last - first;
    return {
      value: (diff > 0 ? "+ " : "- ") + Math.abs(diff).toFixed(1),
      isDown: diff < 0
    };
  };

  const latest = history[history.length - 1] || { weight: 0, bodyfatPerc: 0, smm: 0, timestamp: "" };
  const weightTrend = calculateTrend('weight');
  const fatTrend = calculateTrend('bodyfatPerc');
  const smmTrend = calculateTrend('smm');

  // 4. ĐỊNH DẠNG DỮ LIỆU BIỂU ĐỒ
  const chartLabels = history.map(h => new Date(h.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));

  const commonOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#222' }, ticks: { color: '#555' } },
      x: { grid: { display: false }, ticks: { color: '#555' } }
    }
  };

  const weightChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Cân nặng (kg)',
        data: history.map(h => h.weight),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'SMM (kg)',
        data: history.map(h => h.smm),
        borderColor: '#10b981',
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
  };

  const fatChartData = {
    labels: chartLabels,
    datasets: [{
      fill: true,
      label: 'Body Fat (%)',
      data: history.map(h => h.bodyfatPerc),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
    }]
  };

  if (isLoading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white font-mono">LOADING EVOLUTION DATA...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">
              Body <span className="text-[#e22718]">Evolution_</span>
            </h1>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Theo dõi hành trình biến đổi hình thể</p>
          </div>
        </header>

        {/* Summary Cards - Dữ liệu thật */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard title="Cân nặng" value={latest.weight.toFixed(1)} unit="kg" trend={`${weightTrend.value}kg`} color="blue" isDown={weightTrend.isDown} />
          <SummaryCard title="Tỷ lệ mỡ" value={latest.bodyfatPerc.toFixed(1)} unit="%" trend={`${fatTrend.value}%`} color="red" isDown={fatTrend.isDown} />
          <SummaryCard title="Khối lượng cơ" value={latest.smm.toFixed(1)} unit="kg" trend={`${smmTrend.value}kg`} color="emerald" isDown={smmTrend.isDown} />
          <SummaryCard title="Số lần đo" value={history.length.toString()} unit="Bản ghi" color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ChartCard title="Xu hướng Cân nặng & Cơ bắp" labels={[{color: 'bg-blue-500', name: 'Weight'}, {color: 'bg-emerald-500', name: 'SMM'}]}>
              <Line options={commonOptions} data={weightChartData} />
            </ChartCard>
            <ChartCard title="Biến thiên Tỷ lệ mỡ (%)">
              <Line options={commonOptions} data={fatChartData} />
            </ChartCard>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Lịch sử đo lường</h3>
                <i className="fa-solid fa-clock-rotate-left text-gray-600 text-xs"></i>
              </div>
              <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-800 custom-scrollbar">
                {/* Đảo ngược mảng history để hiện cái mới nhất lên đầu danh sách */}
                {[...history].reverse().map((entry, idx) => (
                  <div key={entry.id} className="p-4 hover:bg-white/5 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-gray-500">
                        {new Date(entry.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <MetricItem label="Weight" value={`${entry.weight}kg`} />
                      <MetricItem label="Fat" value={`${entry.bodyfatPerc}%`} color="text-red-500" />
                      <MetricItem label="SMM" value={`${entry.smm}kg`} color="text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS GIỮ NGUYÊN NHƯNG CHỈNH LẠI MỘT CHÚT LOGIC MÀU SẮC ---
const SummaryCard = ({ title, value, unit, trend, color, isDown }: any) => {
  // Logic màu sắc trend: Giảm cân (isDown) thường là tốt (green), tăng cơ (not isDown) cũng tốt.
  const isPositiveTrend = (title.includes("Cân nặng") || title.includes("mỡ")) ? isDown : !isDown;
  
  return (
    <div className={`bg-[#1a1a1a] border border-[#333] rounded-xl p-5 border-l-4 border-${color}-500`}>
      <p className="text-[10px] text-gray-500 uppercase">{title}</p>
      <div className="flex items-baseline space-x-2 mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-[10px] text-gray-400 font-medium">{unit}</span>
        {trend && (
          <span className={`text-[10px] font-bold ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
            <i className={`fa-solid fa-arrow-${isDown ? 'down' : 'up'} mr-1`}></i>{trend}
          </span>
        )}
      </div>
    </div>
  );
};

const ChartCard = ({ title, labels, children }: any) => (
  <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h3>
      {labels && (
        <div className="flex space-x-4 text-[10px] uppercase font-bold">
          {labels.map((l: any) => (
            <span key={l.name} className="flex items-center">
              <span className={`w-2 h-2 ${l.color} rounded-full mr-2`}></span> {l.name}
            </span>
          ))}
        </div>
      )}
    </div>
    <div className="h-64">{children}</div>
  </div>
);

const MetricItem = ({ label, value, color = "text-white" }: any) => (
  <div>
    <p className="text-[9px] text-gray-600 uppercase">{label}</p>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
);

export default BodyEvolution;