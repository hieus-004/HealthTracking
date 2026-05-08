import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; 
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  ArcElement, Title, Tooltip, Legend, Filler, type ChartOptions
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Đăng ký thêm ArcElement cho biểu đồ tròn (Doughnut)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

interface BodyEvolutionResponse {
  id: number;
  weight: number;
  bodyfatPerc: number;
  smm: number;
  timestamp: string; 
}

const userId = 1;

const BodyEvolution: React.FC = () => {
  const [history, setHistory] = useState<BodyEvolutionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // GỌI API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosClient.get<BodyEvolutionResponse[]>(`user/${userId}/body-evolution`);
        setHistory(response.data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const calculateTrend = (key: keyof BodyEvolutionResponse) => {
    const validHistory = history.filter(h => (h[key] as number) > 0);
    if (validHistory.length < 2) return { value: "0", isDown: false };
    const first = validHistory[0][key] as number;
    const last = validHistory[validHistory.length - 1][key] as number;
    const diff = last - first;
    return { value: (diff > 0 ? "+" : "") + diff.toFixed(1), isDown: diff < 0 };
  };

  const latest = history[history.length - 1] || { weight: 0, bodyfatPerc: 0, smm: 0, timestamp: "" };
  const weightTrend = calculateTrend('weight');
  const fatTrend = calculateTrend('bodyfatPerc');
  const smmTrend = calculateTrend('smm');

  // --- TÍNH TOÁN DATA CHO BIỂU ĐỒ TRÒN (Lần đo mới nhất) ---
  // Khối lượng mỡ (kg) = Cân nặng * (Tỷ lệ mỡ / 100)
  const fatMassKg = (latest.weight * (latest.bodyfatPerc / 100)).toFixed(1);
  const smmKg = latest.smm.toFixed(1);
  // Khối lượng còn lại (Xương, nước, nội tạng)
  const otherMassKg = (latest.weight - parseFloat(fatMassKg) - latest.smm).toFixed(1);

  // --- CONFIG CHART.JS ---
  const chartLabels = history.map(h => new Date(h.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));

  const lineOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false, spanGaps: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { family: 'ui-monospace' } } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'ui-monospace' } } }
    }
  };

  const weightChartData = {
    labels: chartLabels,
    datasets: [
      { label: 'Cân nặng (kg)', data: history.map(h => h.weight === 0 ? null : h.weight), borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.4, borderWidth: 3 },
      { label: 'Cơ bắp (kg)', data: history.map(h => h.smm === 0 ? null : h.smm), borderColor: '#10b981', borderDash: [5, 5], tension: 0.4 }
    ]
  };

  const fatChartData = {
    labels: chartLabels,
    datasets: [{ fill: true, label: 'Tỷ lệ mỡ (%)', data: history.map(h => h.bodyfatPerc === 0 ? null : h.bodyfatPerc), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', tension: 0.4 }]
  };

  // Data biểu đồ tròn
  const compositionData = {
    labels: ['Khối lượng Mỡ', 'Khối lượng Cơ', 'Nước & Xương'],
    datasets: [{
      data: [fatMassKg, smmKg, otherMassKg],
      backgroundColor: ['#ef4444', '#10b981', '#e2e8f0'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-mono text-slate-400">LOADING...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
            Body <span className="text-[#e22718]">Evolution_</span>
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
            Hồ sơ sinh trắc học & Phân tích thành phần cơ thể
          </p>
        </header>

        {/* 1. BỘ 4 CARD CHỈ SỐ VÀNG (Cân bằng hoàn hảo 4 cột) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title="Trọng lượng tổng" value={latest.weight > 0 ? latest.weight.toFixed(1) : '-'} unit="kg" trend={weightTrend.value} color="blue" isDown={weightTrend.isDown} />
          <SummaryCard title="Tỷ lệ mỡ (Body Fat)" value={latest.bodyfatPerc > 0 ? latest.bodyfatPerc.toFixed(1) : '-'} unit="%" trend={fatTrend.value} color="red" isDown={fatTrend.isDown} />
          <SummaryCard title="Cơ xương (SMM)" value={latest.smm > 0 ? latest.smm.toFixed(1) : '-'} unit="kg" trend={smmTrend.value} color="emerald" isDown={smmTrend.isDown} />
          <SummaryCard title="Khối lượng mỡ" value={latest.weight > 0 ? fatMassKg : '-'} unit="kg" trend={null} color="orange" isDown={false} />
        </div>

        {/* 2. KHU VỰC BIỂU ĐỒ (Layout 8 cột Trái - 4 cột Phải) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái (Trend Lines) chiếm 2/3 không gian */}
          <div className="lg:col-span-8 space-y-8">
            <ChartCard title="Xu hướng Cân nặng & Cơ bắp" labels={[{color: 'bg-blue-500', name: 'Weight'}, {color: 'bg-emerald-500', name: 'SMM'}]}>
              <Line options={lineOptions} data={weightChartData} />
            </ChartCard>
            <ChartCard title="Biến thiên Tỷ lệ mỡ (%)">
              <Line options={lineOptions} data={fatChartData} />
            </ChartCard>
          </div>

          {/* Cột phải (Current State) chiếm 1/3 không gian */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex flex-col h-full">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-6">
                Phân bổ cơ thể hiện tại
              </h3>
              
              <div className="flex-grow flex items-center justify-center relative">
                <div className="w-48 h-48">
                  <Doughnut data={compositionData} options={{ cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: true } } }} />
                </div>
                {/* Chữ ở giữa vòng tròn */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-800">{latest.weight > 0 ? latest.weight : '-'}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tổng (Kg)</span>
                </div>
              </div>

              {/* Legend tự custom cho đẹp */}
              <div className="mt-8 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center font-semibold text-slate-600"><span className="w-3 h-3 bg-red-500 rounded-sm mr-2"></span> Mỡ</span>
                  <span className="font-black text-slate-900">{fatMassKg} kg</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center font-semibold text-slate-600"><span className="w-3 h-3 bg-emerald-500 rounded-sm mr-2"></span> Cơ bắp</span>
                  <span className="font-black text-slate-900">{smmKg} kg</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center font-semibold text-slate-600"><span className="w-3 h-3 bg-slate-200 rounded-sm mr-2"></span> Nước/Xương</span>
                  <span className="font-black text-slate-900">{otherMassKg} kg</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. BẢNG DỮ LIỆU CHI TIẾT (Trải dài full màn hình để chốt hạ giao diện) */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              <i className="fa-solid fa-list mr-2 text-slate-400"></i> Nhật ký đo lường chi tiết
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-1 rounded border border-gray-200">
              Tổng: {history.length} bản ghi
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4 w-32">Ngày đo</th>
                  <th className="p-4 text-center">Cân nặng</th>
                  <th className="p-4 text-center">Tỷ lệ mỡ</th>
                  <th className="p-4 text-center">Khối lượng Mỡ</th>
                  <th className="p-4 text-center">Cơ xương (SMM)</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-slate-700 divide-y divide-gray-50">
                {[...history].reverse().map((entry) => {
                  const fatKg = entry.weight > 0 ? (entry.weight * (entry.bodyfatPerc / 100)).toFixed(1) : '-';
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-slate-500">
                        {new Date(entry.timestamp).toLocaleDateString('vi-VN')} <span className="text-gray-300 ml-1">{new Date(entry.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="p-4 text-center font-black text-slate-900">{entry.weight > 0 ? `${entry.weight} kg` : '-'}</td>
                      <td className="p-4 text-center font-bold text-red-500">{entry.bodyfatPerc > 0 ? `${entry.bodyfatPerc} %` : '-'}</td>
                      <td className="p-4 text-center text-orange-500">{fatKg !== '-' ? `${fatKg} kg` : '-'}</td>
                      <td className="p-4 text-center font-bold text-emerald-600">{entry.smm > 0 ? `${entry.smm} kg` : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const SummaryCard = ({ title, value, unit, trend, color, isDown }: any) => {
  const isPositiveTrend = (title.includes("Trọng lượng") || title.includes("mỡ")) ? isDown : !isDown;
  
  return (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-xl p-5 border-t-4 border-t-${color}-500 relative overflow-hidden`}>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold z-10 relative">{title}</p>
      <div className="flex items-baseline space-x-2 mt-2 z-10 relative">
        <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase">{value !== '-' ? unit : ''}</span>
      </div>
      {trend && value !== '-' && (
        <div className="mt-3 z-10 relative">
          <span className={`text-[10px] font-black tracking-widest px-2 py-1 rounded bg-${isPositiveTrend ? 'emerald' : 'red'}-50 ${isPositiveTrend ? 'text-emerald-600' : 'text-red-600'}`}>
            <i className={`fa-solid fa-arrow-${isDown ? 'down' : 'up'} mr-1`}></i>{trend} {unit}
          </span>
        </div>
      )}
      <i className={`fa-solid fa-chart-simple absolute -right-4 -bottom-4 text-6xl text-slate-50 opacity-50`}></i>
    </div>
  );
};

const ChartCard = ({ title, labels, children }: any) => (
  <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">{title}</h3>
      {labels && (
        <div className="flex space-x-4 text-[10px] uppercase font-black text-slate-400">
          {labels.map((l: any) => (
            <span key={l.name} className="flex items-center">
              <span className={`w-2 h-2 ${l.color} rounded-full mr-1.5 shadow-sm`}></span> {l.name}
            </span>
          ))}
        </div>
      )}
    </div>
    <div className="h-[220px]">{children}</div>
  </div>
);

export default BodyEvolution;