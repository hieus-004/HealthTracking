import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// --- 1. MAPPING DỮ LIỆU (Đây là những gì bạn cần lưu trong DB) ---
interface Exercise {
  id: number;
  name: string;
  nameVn: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  injuryTags: string[]; // Quan trọng để lọc AI
}

const ExerciseBrowser: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const muscleParam = searchParams.get('muscle');
    if (muscleParam) {
        const formattedMuscle = muscleParam.charAt(0).toUpperCase() + muscleParam.slice(1);
        setSelectedMuscle(formattedMuscle);
    }
  }, [searchParams]);
  const handleFilterChange = (muscle: string) => {
    setSelectedMuscle(muscle);
    // Cập nhật lại URL để đồng bộ
    if (muscle === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ muscle: muscle.toLowerCase() });
    }
  };

  // Dữ liệu mẫu để bạn hình dung
  const exercises: Exercise[] = [
    {
      id: 1,
      name: "Bench Press",
      nameVn: "Đẩy ngực ngang",
      muscleGroup: "Chest",
      secondaryMuscles: ["Triceps", "Shoulders"],
      equipment: "Barbell",
      difficulty: "Intermediate",
      thumbnail: "https://via.placeholder.com/300x200?text=Bench+Press",
      injuryTags: ["shoulder_pain", "wrist_pain"]
    },
    {
      id: 2,
      name: "Pull Up",
      nameVn: "Hít xà đơn",
      muscleGroup: "Back",
      secondaryMuscles: ["Biceps", "Forearms"],
      equipment: "Bodyweight",
      difficulty: "Advanced",
      thumbnail: "https://via.placeholder.com/300x200?text=Pull+Up",
      injuryTags: ["elbow_pain", "shoulder_pain"]
    }
  ];

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs'];

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-gray-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase italic text-white">
              Exercise <span className="text-[#e22718]">Library_</span>
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Khám phá và phân tích kỹ thuật bài tập</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Tìm bài tập..." 
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded text-xs focus:border-[#e22718] outline-none"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#333] pb-4">
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => handleFilterChange(group)}
              className={`px-4 py-2 text-[10px] font-bold uppercase rounded transition-all ${
                selectedMuscle === group 
                ? 'bg-[#e22718] text-white' 
                : 'bg-[#1e1e1e] text-gray-500 hover:text-white'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(ex => (
            <div key={ex.id} className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden group hover:border-[#e22718] transition-all">
              {/* Thumbnail Container */}
              <div className="relative h-40 bg-gray-800">
                <img src={ex.thumbnail} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {ex.injuryTags.map(tag => (
                    <span key={tag} className="bg-red-900/80 text-[#e22718] text-[8px] font-bold p-1 rounded uppercase">
                      <i className="fa-solid fa-triangle-exclamation mr-1"></i>{tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">{ex.name}</h4>
                    <p className="text-[10px] text-gray-500">{ex.nameVn}</p>
                  </div>
                  <span className={`text-[8px] px-2 py-1 rounded font-bold uppercase ${
                    ex.difficulty === 'Beginner' ? 'bg-green-900/20 text-green-500' :
                    ex.difficulty === 'Intermediate' ? 'bg-blue-900/20 text-blue-500' : 'bg-red-900/20 text-red-500'
                  }`}>
                    {ex.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex items-center text-[10px] text-gray-400">
                    <i className="fa-solid fa-dumbbell mr-1.5 text-[#e22718]"></i>
                    {ex.equipment}
                  </div>
                  <div className="flex items-center text-[10px] text-gray-400">
                    <i className="fa-solid fa-bullseye mr-1.5 text-[#e22718]"></i>
                    {ex.muscleGroup}
                  </div>
                </div>

                <button onClick={() => navigate(`/exercises/${ex.id}`)}
                className="w-full mt-4 py-2 border border-[#333] group-hover:bg-[#e22718] group-hover:border-[#e22718] text-[10px] font-bold uppercase transition-all">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseBrowser;