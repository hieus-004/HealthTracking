import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
// 🚀 Thêm import useNavigate để chuyển trang
import { useNavigate } from 'react-router-dom';

interface Joint {
  id: number;
  name: string;
  desc: string;
  x: number;
  y: number;
}

interface SelectedJoint {
  id: number;
  painLevel: number;
}

const JOINTS: Joint[] = [
  { id: 15, name: 'Cổ', desc: 'Khớp đốt sống cổ, thường chịu áp lực khi tập các bài squat hoặc ngồi sai tư thế.', x: 100, y: 50 },
  { id: 16, name: 'Vai Trái', desc: 'Ổ khớp vai trái, rất dễ chấn thương trong các bài tập đẩy ngực (Bench Press) hoặc đẩy vai.', x: 75, y: 65 },
  { id: 17, name: 'Vai Phải', desc: 'Ổ khớp vai phải, tham gia vào hầu hết các chuyển động của thân trên.', x: 125, y: 65 },
  { id: 18, name: 'Khuỷu Tay Trái', desc: 'Khớp khuỷu tay trái, thường bị đau mỏi do các bài tập kéo (Pull) hoặc cuốn tạ (Curls).', x: 55, y: 105 },
  { id: 19, name: 'Khuỷu Tay Phải', desc: 'Khớp khuỷu tay phải, điểm chịu lực chính của cẳng tay.', x: 145, y: 105 },
  { id: 20, name: 'Cổ Tay Trái', desc: 'Khớp cổ tay trái, nhạy cảm với các bài tập đẩy khi cầm tạ sai góc.', x: 45, y: 145 },
  { id: 21, name: 'Cổ Tay Phải', desc: 'Khớp cổ tay phải, cần khởi động kỹ trước các bài Press.', x: 155, y: 145 },
  { id: 22, name: 'Hông Trái', desc: 'Khớp hông trái, đóng vai trò quan trọng trong các bài tập chân như Squat và Deadlift.', x: 85, y: 135 },
  { id: 23, name: 'Hông Phải', desc: 'Khớp hông phải, điểm kết nối lực giữa thân dưới và thân trên.', x: 115, y: 135 },
  { id: 24, name: 'Đầu Gối Trái', desc: 'Khớp gối trái, dễ tổn thương nếu khóa khớp gối hoặc sai form khi tập Leg Press.', x: 85, y: 200 },
  { id: 25, name: 'Đầu Gối Phải', desc: 'Khớp gối phải, chịu áp lực rất lớn khi chạy hoặc tập thân dưới.', x: 115, y: 200 },
  { id: 26, name: 'Cổ Chân Trái', desc: 'Khớp cổ chân trái, linh hoạt nhưng dễ bong gân.', x: 85, y: 260 },
  { id: 27, name: 'Cổ Chân Phải', desc: 'Khớp cổ chân phải, hỗ trợ cân bằng và truyền lực từ đất lên cơ thể.', x: 115, y: 260 },
  { id: 28, name: 'Lưng Dưới', desc: 'Khu vực cột sống thắt lưng. Cực kỳ nhạy cảm và dễ gặp chấn thương (đau mỏi cơ, thoát vị) nếu bị cong lưng khi tập Deadlift hoặc Squat nặng.', x: 100, y: 105 },
];

const userId = 1;

const BodyDiagnostic: React.FC = () => {
  const [selectedJoints, setSelectedJoints] = useState<SelectedJoint[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate(); // 🚀 Khởi tạo hook điều hướng

  useEffect(() => {
    const fetchLatestInjuries = async () => {
      try {
        const response = await axiosClient.get(`/injury/${userId}`);

        const formattedData = response.data.map((item: any) => ({
          id: item.joint?.jointId || item.jointId,
          painLevel: item.injuryScale
        }));

        setSelectedJoints(formattedData);
      } catch (error) {
        console.error("Chưa có dữ liệu chấn thương cũ hoặc lỗi tải.");
      }
    };

    fetchLatestInjuries();
  }, []);

  const toggleJoint = (id: number) => {
    setSelectedJoints(prev => {
      const exists = prev.find(j => j.id === id);
      if (exists) {
        return prev.filter(j => j.id !== id);
      } else {
        return [...prev, { id, painLevel: 5 }];
      }
    });
  };

  const updatePainLevel = (id: number, level: number) => {
    setSelectedJoints(prev =>
      prev.map(j => j.id === id ? { ...j, painLevel: level } : j)
    );
  };

  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-yellow-600';
    if (level <= 7) return 'text-orange-500';
    return 'text-[#e22718]';
  };

  const getPainLabel = (level: number) => {
    if (level <= 3) return 'Căng mỏi';
    if (level <= 7) return 'Đau nhức';
    return 'Chấn thương';
  };

  const handleSyncToAI = async () => {
    setIsSyncing(true);

    try {
      const currentTimestamp = new Date().toISOString().split('T')[0];

      const payload = selectedJoints.map(sj => ({
        userId: userId,
        timestamp: currentTimestamp,
        jointId: sj.id,
        injuryScale: sj.painLevel
      }));

      if (payload.length === 0) {
        payload.push({
          userId: userId,
          timestamp: currentTimestamp,
          jointId: -1, 
          injuryScale: 0
        });
      }

      await axiosClient.post('/injury', payload);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sau khi lưu xong, có thể mở alert hoặc tự động đá sang trang Recovery luôn
      alert("Dữ liệu chẩn đoán đã được đồng bộ thành công!");

    } catch (error) {
      alert("Lỗi kết nối đến máy chủ. Vui lòng thử lại.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Bio_Mechanical_<span className="text-[#e22718]">Mapping_v2.0</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Xác định vị trí và cường độ chấn thương</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* CỘT TRÁI: MÔ HÌNH NGƯỜI SVG & NÚT CHUYỂN TRANG */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            
            {/* Box chứa mô hình */}
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 flex justify-center shadow-lg">
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#e22718] animate-ping"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Scanner_Active</span>
              </div>

              <svg viewBox="0 0 200 300" className="w-full max-w-[250px] drop-shadow-md">
                <path d="M100,20 C110,20 120,30 120,45 C120,55 110,60 100,60 C90,60 80,55 80,45 C80,30 90,20 100,20 M75,65 L125,65 L135,100 L155,145 M75,65 L65,100 L45,145 M90,65 L110,65 L115,135 L120,200 L115,265 M90,65 L85,135 L80,200 L85,265" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                <path d="M85,65 Q100,60 115,65 L110,135 Q100,140 90,135 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

                {JOINTS.map(joint => {
                  const isSelected = selectedJoints.some(j => j.id === joint.id);
                  return (
                    <g key={joint.id} className="cursor-pointer group" onClick={() => toggleJoint(joint.id)}>
                      <circle cx={joint.x} cy={joint.y} r="16" fill="transparent" />
                      <circle cx={joint.x} cy={joint.y} r="10" className="fill-transparent group-hover:fill-red-100 transition-colors duration-200" />
                      <circle
                        cx={joint.x} cy={joint.y} r={isSelected ? "7" : "5"}
                        className={`transition-all duration-300 ${isSelected ? "fill-[#e22718] stroke-white stroke-2 drop-shadow-md" : "fill-slate-300 group-hover:fill-red-400"}`}
                      />
                      {isSelected && (
                        <circle
                          cx={joint.x} cy={joint.y} r="12"
                          className="fill-none stroke-[#e22718] stroke-[1.5] animate-ping origin-center opacity-70"
                          style={{ transformOrigin: `${joint.x}px ${joint.y}px` }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 🚀 NÚT CHUYỂN SANG TRANG RECOVERY */}
            <button 
              onClick={() => navigate('/recoveryChart')} // Đổi đường dẫn này theo Route thật của ông
              className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <i className="fa-solid fa-chart-line text-blue-600"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">Xem Biểu Đồ Phục Hồi</span>
            </button>

          </div>

          {/* CỘT PHẢI: CHI TIẾT CƯỜNG ĐỘ ĐAU */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg border-t-2 border-t-[#e22718] min-h-[350px] flex flex-col">
              <h3 className="text-xs font-black uppercase text-gray-500 mb-4 tracking-widest italic flex items-center">
                <i className="fa-solid fa-wave-square mr-3 text-[#e22718]"></i> Pain_Intensity_Calibration
              </h3>

              <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {selectedJoints.length > 0 ? (
                  selectedJoints.map(sj => {
                    const joint = JOINTS.find(j => j.id === sj.id);
                    return (
                      <div key={sj.id} className="bg-slate-50 p-4 border border-gray-200 rounded-lg animate-in fade-in slide-in-from-left-2">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-black text-slate-800 uppercase tracking-wider">{joint?.name}</span>
                          <button onClick={() => toggleJoint(sj.id)} className="text-gray-400 hover:text-[#e22718] transition-colors"><i className="fa-solid fa-trash-can text-xs"></i></button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="w-12 text-[10px] font-bold text-gray-500 text-right uppercase">Level {sj.painLevel}</div>

                          <input
                            type="range" min="1" max="10" step="1"
                            value={sj.painLevel}
                            onChange={(e) => updatePainLevel(sj.id, parseInt(e.target.value))}
                            className="flex-grow h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e22718]"
                          />

                          <div className={`w-20 text-[9px] font-black uppercase tracking-widest text-center ${getPainColor(sj.painLevel)}`}>
                            {getPainLabel(sj.painLevel)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-60 py-10">
                    <i className="fa-solid fa-street-view text-4xl mb-3 text-gray-300"></i>
                    <p className="text-[10px] text-gray-400 italic uppercase tracking-widest">Hãy chọn ổ khớp trên mô hình</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleSyncToAI}
                disabled={isSyncing}
                className={`w-full mt-6 py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center ${selectedJoints.length > 0 && !isSyncing
                  ? "bg-[#e22718] hover:bg-red-700 text-white shadow-lg shadow-red-500/30"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
              >
                {isSyncing ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Analyzing_Bio_Data...
                  </>
                ) : (
                  <>
                    Sync_To_AI_Agent_ <i className="fa-solid fa-upload ml-2"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyDiagnostic;