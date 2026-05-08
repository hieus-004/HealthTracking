import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';

// --- 1. INTERFACE CHO API TRẢ VỀ ---
interface ExerciseAPI {
  exId: number;
  exName: string;
  exNameVN: string;
  partName: string;
  difficulty: number;
  equipment: string;
  ytUrl: string;
  pr: number;
  instruction: string[];
  suitPerc: number;
  caution?: string; 
  injuryTags?: string[]; 
}

// --- 2. INTERFACE CHO UI HIỂN THỊ ---
interface ExerciseUI {
  id: number;
  name: string;
  nameVn: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: string;
  videoUrl: string; 
  instructions: string[]; 
  safetyTips: string[];
  matchScore: number;
  injuryTags: string[];
}

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState<ExerciseUI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const response = await axiosClient.get<ExerciseAPI>(`/exercisesDetails/${id}`);
        const data = response.data;

        let diffLabel = 'Beginner';
        if (data.difficulty === 2) diffLabel = 'Intermediate';
        if (data.difficulty === 3) diffLabel = 'Advanced';

        let embedUrl = data.ytUrl || '';
        if (embedUrl.includes('watch?v=')) {
          embedUrl = embedUrl.replace('watch?v=', 'embed/');
        }

        let tags: string[] = [];
        if (data.injuryTags) {
            tags = data.injuryTags;
        } else if (data.caution) {
            tags = data.caution.split(',').map(t => t.trim());
        }

        const mappedData: ExerciseUI = {
          id: data.exId,
          name: data.exName,
          nameVn: data.exNameVN || 'Chưa cập nhật tên VN',
          muscleGroup: data.partName || 'Khác',
          equipment: data.equipment || 'Bodyweight',
          difficulty: diffLabel,
          videoUrl: embedUrl,
          instructions: data.instruction || [],
          matchScore: data.suitPerc || 0,
          injuryTags: tags,
          
          secondaryMuscles: ["Cơ phụ 1", "Cơ phụ 2"],
          safetyTips: [
            "Luôn khởi động kỹ trước khi tập.",
            "Lắng nghe cơ thể, dừng lại nếu thấy đau nhói."
          ]
        };

        setExercise(mappedData);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Lỗi tải chi tiết bài tập:", error.response?.data || error.message);
        } else {
          console.error("Lỗi hệ thống:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchExerciseDetail();
    }
  }, [id]); 

  // --- 4. RENDER CÁC TRẠNG THÁI LOADING / ERROR (Nền sáng) ---
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex justify-center items-center">
         <i className="fa-solid fa-circle-notch fa-spin text-[#e22718] text-4xl"></i>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex flex-col justify-center items-center text-slate-800">
         <i className="fa-solid fa-dumbbell text-4xl text-gray-300 mb-4"></i>
         <h2 className="text-xl font-black uppercase tracking-widest text-slate-500 mb-6">Không tìm thấy bài tập</h2>
         <button onClick={() => navigate(-1)} className="px-6 py-2 border border-[#e22718] text-[#e22718] text-xs font-bold uppercase rounded hover:bg-[#e22718] hover:text-white transition-all shadow-sm">
           Quay lại thư viện
         </button>
      </div>
    );
  }

  // --- 5. RENDER UI CHI TIẾT ---
  return (
    // Nền xám cực nhạt, chữ mặc định là slate-800
    <div className="min-h-screen p-6 bg-gray-50 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-xs font-bold text-slate-500 hover:text-[#e22718] transition-colors mb-6 uppercase tracking-widest"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại thư viện
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CỘT TRÁI: VIDEO & HƯỚNG DẪN */}
          <div className="lg:col-span-8 space-y-8">
            {/* Video Player - Vẫn giữ bg-black cho khu vực iframe để tạo độ sâu, đổi viền thành gray-200 */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-200 shadow-md relative">
              {exercise.videoUrl ? (
                <iframe 
                  className="w-full h-full"
                  src={exercise.videoUrl}
                  title={exercise.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                   <i className="fa-brands fa-youtube text-5xl mb-2"></i>
                   <span className="text-xs uppercase tracking-widest">Video không khả dụng</span>
                </div>
              )}
            </div>

            {/* Step by Step - Nền trắng, viền nhạt */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase italic mb-6 border-l-4 border-[#e22718] pl-4 text-slate-900">
                Kỹ thuật thực hiện_
              </h3>
              <div className="space-y-6">
                {exercise.instructions.length > 0 ? (
                  exercise.instructions.map((step, index) => (
                    <div key={index} className="flex space-x-4">
                      {/* Vòng tròn đánh số: đổi sang nền đỏ siêu nhạt (red-50) để hợp Light Theme */}
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-[#e22718] text-xs font-black flex items-center justify-center border border-red-100 shadow-sm">
                        {index + 1}
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic uppercase tracking-widest">Chưa có hướng dẫn cho bài tập này.</p>
                )}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG SỐ & PHÂN TÍCH */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Info - Nền trắng */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 border-t-4 border-t-[#e22718] shadow-sm">
              <div className="mb-4">
                {/* Badge độ khó dùng màu sáng */}
                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${
                  exercise.difficulty === 'Beginner' ? 'bg-green-50 text-green-600 border border-green-200' :
                  exercise.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase italic text-slate-900 mb-1">{exercise.nameVn}</h1>
              <p className="text-xs text-slate-500 mb-6 italic">{exercise.name}</p>

              <div className="space-y-4">
                {/* Đổi màu viền đường kẻ sang gray-100 */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Cơ chính</span>
                  <span className="text-xs font-bold text-blue-600 uppercase">{exercise.muscleGroup}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Thiết bị</span>
                  <span className="text-xs font-bold text-slate-700 uppercase">{exercise.equipment}</span>
                </div>
              </div>
            </div>

            {/* Injury Alerts */}
            {exercise.injuryTags.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center">
                  <i className="fa-solid fa-triangle-exclamation text-[#e22718] mr-2"></i> Cảnh báo chấn thương
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.injuryTags.map((tag, idx) => (
                    // Tag chấn thương nền đỏ nhạt (red-50)
                    <span key={idx} className="text-[9px] bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded font-black uppercase tracking-tighter shadow-sm">
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                
                {/* Safety Tips - Đường kẻ chia cắt màu xám nhạt (gray-200) */}
                <ul className="mt-6 space-y-3 pt-4 border-t border-gray-200">
                  {exercise.safetyTips.map((tip, i) => (
                    <li key={i} className="text-[11px] text-slate-600 flex items-start italic leading-relaxed">
                      <span className="text-[#e22718] mr-2 text-sm leading-none">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;