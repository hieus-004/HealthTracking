import React, { useState } from 'react';

interface Joint {
  id: string;
  name: string;
  x: number;
  y: number;
}

// Cấu trúc mới lưu thêm mức độ đau
interface SelectedJoint {
  id: string;
  painLevel: number;
}

const JOINTS: Joint[] = [
  { id: 'neck', name: 'Cổ', x: 100, y: 45 },
  { id: 'l-shoulder', name: 'Vai Trái', x: 75, y: 65 },
  { id: 'r-shoulder', name: 'Vai Phải', x: 125, y: 65 },
  { id: 'l-elbow', name: 'Khuỷu Tay Trái', x: 55, y: 105 },
  { id: 'r-elbow', name: 'Khuỷu Tay Phải', x: 145, y: 105 },
  { id: 'l-wrist', name: 'Cổ Tay Trái', x: 45, y: 145 },
  { id: 'r-wrist', name: 'Cổ Tay Phải', x: 155, y: 145 },
  { id: 'lower-back', name: 'Lưng Dưới', x: 100, y: 120 },
  { id: 'l-hip', x: 85, y: 135, name: 'Hông Trái' },
  { id: 'r-hip', x: 115, y: 135, name: 'Hông Phải' },
  { id: 'l-knee', x: 85, y: 200, name: 'Đầu Gối Trái' },
  { id: 'r-knee', x: 115, y: 200, name: 'Đầu Gối Phải' },
  { id: 'l-ankle', x: 85, y: 260, name: 'Cổ Chân Trái' },
  { id: 'r-ankle', x: 115, y: 260, name: 'Cổ Chân Phải' },
];

const BodyDiagnostic: React.FC = () => {
  // Đổi state sang lưu Object
  const [selectedJoints, setSelectedJoints] = useState<SelectedJoint[]>([]);

  // Bấm vào SVG để Toggle (Mặc định mức đau là 5)
  const toggleJoint = (id: string) => {
    setSelectedJoints(prev => {
      const exists = prev.find(j => j.id === id);
      if (exists) {
        return prev.filter(j => j.id !== id);
      } else {
        return [...prev, { id, painLevel: 5 }];
      }
    });
  };

  // Cập nhật mức đau từ Slider
  const updatePainLevel = (id: string, level: number) => {
    setSelectedJoints(prev => 
      prev.map(j => j.id === id ? { ...j, painLevel: level } : j)
    );
  };

  // Helper để lấy màu theo mức độ đau
  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-yellow-500'; // Đau nhẹ, mỏi
    if (level <= 7) return 'text-orange-500'; // Đau vừa, cản trở tập luyện
    return 'text-[#e22718]'; // Đau dữ dội, chấn thương
  };

  const getPainLabel = (level: number) => {
    if (level <= 3) return 'Căng mỏi';
    if (level <= 7) return 'Đau nhức';
    return 'Chấn thương';
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Bio_Mechanical_<span className="text-[#e22718]">Mapping_v2.0</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Xác định vị trí và cường độ chấn thương</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* CỘT TRÁI: MÔ HÌNH NGƯỜI SVG (Chiếm 2 phần) */}
          <div className="lg:col-span-2 relative bg-[#1a1a1a] rounded-xl border border-[#333] p-6 flex justify-center shadow-2xl">
            <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#e22718] animate-ping"></div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Scanner_Active</span>
            </div>

            <svg viewBox="0 0 200 300" className="w-full max-w-[250px] drop-shadow-[0_0_15px_rgba(226,39,24,0.1)]">
              <path d="M100,20 C110,20 120,30 120,45 C120,55 110,60 100,60 C90,60 80,55 80,45 C80,30 90,20 100,20 M75,65 L125,65 L135,100 L155,145 M75,65 L65,100 L45,145 M90,65 L110,65 L115,135 L120,200 L115,265 M90,65 L85,135 L80,200 L85,265" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
              <path d="M85,65 Q100,60 115,65 L110,135 Q100,140 90,135 Z" fill="#222" stroke="#444" strokeWidth="1" />

              {JOINTS.map(joint => {
                const isSelected = selectedJoints.some(j => j.id === joint.id);
                return (
                  <g key={joint.id} className="cursor-pointer group" onClick={() => toggleJoint(joint.id)}>
                    <circle cx={joint.x} cy={joint.y} r="10" fill="transparent" />
                    <circle 
                      cx={joint.x} cy={joint.y} r={isSelected ? "5" : "3"} 
                      className={`transition-all duration-300 ${isSelected ? "fill-[#e22718] stroke-white stroke-2 shadow-[0_0_10px_#e22718]" : "fill-gray-600 group-hover:fill-blue-500"}`}
                    />
                    {isSelected && <circle cx={joint.x} cy={joint.y} r="8" className="fill-none stroke-[#e22718] stroke-1 animate-ping" />}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* CỘT PHẢI: CHI TIẾT CƯỜNG ĐỘ ĐAU (Chiếm 3 phần) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#1e1e1e] border border-[#333] p-5 rounded-lg border-t-2 border-t-[#e22718] min-h-[350px] flex flex-col">
              <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest italic flex items-center">
                <i className="fa-solid fa-wave-square mr-3 text-[#e22718]"></i> Pain_Intensity_Calibration
              </h3>
              
              <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {selectedJoints.length > 0 ? (
                  selectedJoints.map(sj => {
                    const joint = JOINTS.find(j => j.id === sj.id);
                    return (
                      <div key={sj.id} className="bg-[#151515] p-4 border border-[#333] rounded-lg animate-in fade-in slide-in-from-left-2">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-black text-white uppercase tracking-wider">{joint?.name}</span>
                          <button onClick={() => toggleJoint(sj.id)} className="text-gray-500 hover:text-[#e22718] transition-colors"><i className="fa-solid fa-trash-can text-xs"></i></button>
                        </div>
                        
                        {/* Khu vực Slider chỉnh mức đau */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 text-[10px] font-bold text-gray-500 text-right uppercase">Level {sj.painLevel}</div>
                          
                          <input 
                            type="range" min="1" max="10" step="1" 
                            value={sj.painLevel}
                            onChange={(e) => updatePainLevel(sj.id, parseInt(e.target.value))}
                            className="flex-grow h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#e22718]"
                          />
                          
                          <div className={`w-20 text-[9px] font-black uppercase tracking-widest text-center ${getPainColor(sj.painLevel)}`}>
                            {getPainLabel(sj.painLevel)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
                    <i className="fa-solid fa-street-view text-4xl mb-3 text-gray-600"></i>
                    <p className="text-[10px] text-gray-500 italic uppercase tracking-widest">Hãy chọn ổ khớp trên mô hình 3D</p>
                  </div>
                )}
              </div>

              <button 
                disabled={selectedJoints.length === 0}
                className={`w-full mt-6 py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded transition-all ${
                  selectedJoints.length > 0 
                  ? "bg-[#e22718] hover:bg-red-700 text-white shadow-lg shadow-red-900/40" 
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Sync_To_AI_Agent_ <i className="fa-solid fa-upload ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyDiagnostic;