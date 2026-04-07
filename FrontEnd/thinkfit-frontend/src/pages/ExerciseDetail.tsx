import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- 1. INTERFACE CHI TIẾT (Bổ sung thêm phần Instructions cho DB) ---
interface ExerciseDetail {
  id: number;
  name: string;
  nameVn: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: string;
  videoUrl: string; // Link YouTube hoặc GIF
  instructions: string[]; // Các bước thực hiện
  safetyTips: string[];
  matchScore: number;
  injuryTags: string[];
}

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Dữ liệu mẫu (Sau này bạn sẽ fetch từ API: /api/exercises/{id})
  const exercise: ExerciseDetail = {
    id: Number(id),
    name: "Barbell Bench Press",
    nameVn: "Đẩy ngực ngang với thanh đòn",
    muscleGroup: "Chest",
    secondaryMuscles: ["Triceps", "Front Delts"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", // Ví dụ link nhúng
    instructions: [
      "Nằm ngửa trên ghế phẳng, hai chân đặt chắc chắn trên sàn.",
      "Nắm thanh đòn với độ rộng hơn vai một chút.",
      "Hạ thanh đòn xuống giữa ngực một cách kiểm soát.",
      "Đẩy mạnh thanh đòn lên vị trí bắt đầu trong khi thở ra."
    ],
    safetyTips: [
      "Không khóa khớp cùi chỏ ở vị trí cao nhất.",
      "Giữ bả vai ép chặt xuống ghế.",
      "Luôn có người hỗ trợ (spotter) nếu tập mức tạ nặng."
    ],
    matchScore: 95,
    injuryTags: ["shoulder_pain", "wrist_pain"]
  };

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-gray-200">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-xs font-bold text-gray-500 hover:text-[#e22718] transition-colors mb-6 uppercase tracking-widest"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại thư viện
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CỘT TRÁI: VIDEO & HƯỚNG DẪN (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-[#333] shadow-2xl relative">
              <iframe 
                className="w-full h-full"
                src={exercise.videoUrl}
                title={exercise.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Step by Step */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8">
              <h3 className="text-sm font-black uppercase italic mb-6 border-l-4 border-[#e22718] pl-4">
                Kỹ thuật thực hiện_
              </h3>
              <div className="space-y-6">
                {exercise.instructions.map((step, index) => (
                  <div key={index} className="flex space-x-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#333] text-[#e22718] text-xs font-bold flex items-center justify-center border border-[#444]">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG SỐ & PHÂN TÍCH (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Info */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 border-t-4 border-t-[#e22718]">
              <div className="mb-4">
                <span className="text-[10px] bg-red-900/20 text-[#e22718] px-2 py-0.5 rounded font-bold uppercase">
                  {exercise.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase italic text-white mb-1">{exercise.name}</h1>
              <p className="text-xs text-gray-500 mb-6">{exercise.nameVn}</p>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#333]">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Cơ chính</span>
                  <span className="text-xs font-bold text-blue-400">{exercise.muscleGroup}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#333]">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Thiết bị</span>
                  <span className="text-xs font-bold text-gray-300">{exercise.equipment}</span>
                </div>
              </div>
            </div>

            {/* Injury Alerts */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest flex items-center">
                <i className="fa-solid fa-triangle-exclamation text-[#e22718] mr-2"></i> Cảnh báo chấn thương
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.injuryTags.map(tag => (
                  <span key={tag} className="text-[9px] bg-red-900/10 text-red-500 border border-red-900/30 px-2 py-1 rounded font-bold uppercase">
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {exercise.safetyTips.map((tip, i) => (
                  <li key={i} className="text-[11px] text-gray-400 flex items-start italic">
                    <span className="text-[#e22718] mr-2">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;