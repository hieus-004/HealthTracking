import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient'; 
import axios from 'axios';

// --- 1. INTERFACE CHO API TRẢ VỀ ---
interface ExerciseAPI {
  exerciseId: number;
  exerciseName: string;
  exerciseNameVN: string;
  partName: string;
  difficulty: number;
  equipment: string;
  suitPerc: number;
  pr: number;
  exImgUrl?: string; 
  caution?: string; 
}

// --- 2. INTERFACE CHO UI HIỂN THỊ ---
interface ExerciseUI {
  id: number;
  name: string;
  nameVn: string;
  muscleGroup: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  injuryTags: string[];
}

const ExerciseBrowser: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState<ExerciseUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // CẬP NHẬT TÊN CÁC TAB KHỚP VỚI DATABASE
  const muscleGroups = [
    'All', 
    'Ngực (Chest)', 
    'Lưng (Back)', 
    'Chân (Legs)', 
    'Vai (Shoulders)', 
    'Tay (Arms)', 
    'Lõi (Core)'
  ];

  // ÁNH XẠ ID TỪ URL PARAM SANG TÊN TAB (Cập nhật ID 6, 7, 8)
  const idToTabMap: Record<string, string> = {
    '1': 'Ngực (Chest)',
    '2': 'Lưng (Back)',
    '3': 'Chân (Legs)',
    '6': 'Vai (Shoulders)',
    '7': 'Tay (Arms)',
    '8': 'Lõi (Core)'
  };

  // ÁNH XẠ TỪ TÊN TAB SANG ID ĐỂ ĐẨY LÊN URL
  const tabToIdMap: Record<string, string> = {
    'Ngực (Chest)': '1',
    'Lưng (Back)': '2',
    'Chân (Legs)': '3',
    'Vai (Shoulders)': '6',
    'Tay (Arms)': '7',
    'Lõi (Core)': '8'
  };

  useEffect(() => {
    const muscleIdParam = searchParams.get('muscleId');
    
    if (muscleIdParam && idToTabMap[muscleIdParam]) {
      setSelectedMuscle(idToTabMap[muscleIdParam]);
    } else {
      setSelectedMuscle('All');
    }
  }, [searchParams]);

  const handleFilterChange = (muscle: string) => {
    setSelectedMuscle(muscle);
    if (muscle === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ muscleId: tabToIdMap[muscle] });
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axiosClient.get<ExerciseAPI[]>('/exercisesBrowser');
        
        const mappedData: ExerciseUI[] = response.data.map(ex => {
          let diffLabel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
          if (ex.difficulty === 2) diffLabel = 'Intermediate';
          if (ex.difficulty === 3) diffLabel = 'Advanced';

          const tags = ex.caution ? ex.caution.split(',').map(tag => tag.trim()) : [];

          const imgUrl = ex.exImgUrl 
            ? `http://localhost:8080/uploads/exercises/${ex.exImgUrl}` 
            : 'https://via.placeholder.com/300x200?text=No+Image';

          return {
            id: ex.exerciseId,
            name: ex.exerciseName,
            nameVn: ex.exerciseNameVN || 'Chưa cập nhật tên VN',
            muscleGroup: ex.partName || 'Khác',
            equipment: ex.equipment || 'Bodyweight',
            difficulty: diffLabel,
            thumbnail: imgUrl,
            injuryTags: tags
          };
        });

        setExercises(mappedData);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Lỗi API:", error.response?.data || error.message);
        } else {
          console.error("Lỗi hệ thống:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(ex => {
    const matchMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        ex.nameVn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMuscle && matchSearch;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase italic text-slate-900">
              Exercise <span className="text-[#e22718]">Library_</span>
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Khám phá và phân tích kỹ thuật bài tập</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/bodyDiag')} 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-white shadow-sm border border-[#e22718] text-[#e22718] hover:bg-[#e22718] hover:text-white transition-all duration-300 rounded text-[10px] font-black uppercase tracking-widest group"
            >
              <i className="fa-solid fa-street-view text-sm group-hover:animate-pulse"></i>
              <span>Bio-Scan_Chấn_Thương_</span>
            </button>

            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input 
                type="text" 
                placeholder="Tìm bài tập (Eng/VN)..." 
                className="w-full pl-10 pr-4 py-2 bg-white shadow-sm border border-gray-300 rounded text-xs text-slate-800 focus:border-[#e22718] outline-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => handleFilterChange(group)}
              className={`px-4 py-2 text-[10px] font-bold uppercase rounded transition-all shadow-sm ${
                selectedMuscle === group 
                ? 'bg-[#e22718] text-white shadow-red-500/30' 
                : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Exercise Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-[#e22718]">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
          </div>
        ) : filteredExercises.length === 0 ? (
           <div className="text-center py-20 text-slate-500 text-xs uppercase tracking-widest border border-dashed border-gray-300 rounded bg-white">
             Không tìm thấy bài tập nào.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map(ex => (
              <div key={ex.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:border-[#e22718] transition-all shadow-sm hover:shadow-md">
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img src={ex.thumbnail} alt={ex.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  
                  {ex.injuryTags.length > 0 && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      {ex.injuryTags.map(tag => (
                        <button key={tag} onClick={() => navigate('/bodyDiag')} className="bg-white/95 border border-red-200 text-red-600 text-[8px] font-black p-1.5 rounded uppercase tracking-tighter shadow-sm hover:bg-[#e22718] hover:text-white hover:border-[#e22718] transition-colors">
                          <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>{tag.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">{ex.nameVn}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 italic">{ex.name}</p>
                    </div>
                    <span className={`text-[8px] px-2 py-1.5 rounded font-black uppercase tracking-widest shrink-0 ${
                      ex.difficulty === 'Beginner' ? 'bg-green-50 text-green-600 border border-green-200' :
                      ex.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="flex items-center text-[10px] text-slate-500 font-mono">
                      <i className="fa-solid fa-dumbbell mr-2 text-[#e22718]"></i>{ex.equipment}
                    </div>
                    <div className="flex items-center text-[10px] text-slate-500 font-mono">
                      <i className="fa-solid fa-bullseye mr-2 text-[#e22718]"></i>{ex.muscleGroup}
                    </div>
                  </div>

                  <button onClick={() => navigate(`/exercises/${ex.id}`)}
                  className="w-full mt-5 py-3 border border-gray-200 bg-gray-50 group-hover:bg-[#e22718] group-hover:border-[#e22718] text-slate-600 group-hover:text-white text-[10px] font-black uppercase tracking-widest transition-all rounded shadow-sm">
                    Phân Tích Chi Tiết_
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseBrowser;