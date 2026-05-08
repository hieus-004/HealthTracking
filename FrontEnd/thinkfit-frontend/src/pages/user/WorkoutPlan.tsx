import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface Exercise {
  detailId: number;
  exId: number;
  name: string;
  sets: number;
  reps: string;
  target: string;
}

interface DailyPlan {
  dayId: number;
  dayName: string;
  shortDay: string;
  title: string;
  isRest: boolean;
  intensity: 'Max' | 'High' | 'Moderate' | 'Low' | '-';
  exercises: Exercise[];
}

// KHỞI TẠO KHUNG 7 NGÀY TRỐNG MẶC ĐỊNH
const EMPTY_WEEK: DailyPlan[] = [
  { dayId: 1, dayName: 'Thứ 2', shortDay: 'Mon', title: 'Tùy chỉnh', isRest: true, intensity: '-', exercises: [] },
  { dayId: 2, dayName: 'Thứ 3', shortDay: 'Tue', title: 'Tùy chỉnh', isRest: true, intensity: '-', exercises: [] },
  { dayId: 3, dayName: 'Thứ 4', shortDay: 'Wed', title: 'Tùy chỉnh', isRest: true, intensity: '-', exercises: [] },
  { dayId: 4, dayName: 'Thứ 5', shortDay: 'Thu', title: 'Tùy chỉnh', isRest: true, intensity: '-', exercises: [] },
  { dayId: 5, dayName: 'Thứ 6', shortDay: 'Fri', title: 'Tùy chỉnh', isRest: true, intensity: '-', exercises: [] },
  { dayId: 6, dayName: 'Thứ 7', shortDay: 'Sat', title: 'Tùy chỉnh', isRest: true, intensity: '-', exercises: [] },
  { dayId: 7, dayName: 'Chủ Nhật', shortDay: 'Sun', title: 'Nghỉ ngơi', isRest: true, intensity: '-', exercises: [] },
];

const WorkoutPlan: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ DỮ LIỆU CHÍNH ---
  const [activePlanId, setActivePlanId] = useState<number | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<DailyPlan[]>(EMPTY_WEEK);
  const [selectedDayId, setSelectedDayId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  // STATE LƯU THƯ VIỆN BÀI TẬP TỪ API
  const [exerciseLibrary, setExerciseLibrary] = useState<any[]>([]);

  const activeDay = weeklyPlan.find(day => day.dayId === selectedDayId) || weeklyPlan[0];
  const totalExercises = activeDay.exercises.length;
  const totalSets = activeDay.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const estimatedTime = totalSets * 5;

  // --- MODAL STATES ---
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>('PDF');

  const [genDays, setGenDays] = useState<number[]>([1, 2, 4, 5]);
  const [genSplit, setGenSplit] = useState<string>('U/L');

  const DAYS_OF_WEEK = [
    { id: 1, label: 'T2' }, { id: 2, label: 'T3' }, { id: 3, label: 'T4' },
    { id: 4, label: 'T5' }, { id: 5, label: 'T6' }, { id: 6, label: 'T7' }, { id: 7, label: 'CN' }
  ];

  const SPLIT_OPTIONS = [
    { id: 'U/L', name: 'Upper / Lower', desc: 'Tập trung thân trên/dưới. Tốt cho người bận rộn.' },
    { id: 'PPL', name: 'Push / Pull / Legs', desc: 'Chia theo chuyển động Đẩy/Kéo/Chân.' },
  ];

  // --- 1. FETCH DỮ LIỆU LỊCH TẬP VÀ THƯ VIỆN BÀI TẬP TỪ SPRING BOOT ---
  const fetchActivePlan = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/workout-plan/active');

      if (response.status === 204 || !response.data) {
        setWeeklyPlan(EMPTY_WEEK);
        setActivePlanId(null);
      } else {
        const planData = response.data;
        setActivePlanId(planData.planId);

        const newWeeklyPlan = JSON.parse(JSON.stringify(EMPTY_WEEK));

        if (planData.planDetails && planData.planDetails.length > 0) {
          planData.planDetails.forEach((detail: any) => {
            const dayIndex = detail.dayOfWeek - 1;
            if (newWeeklyPlan[dayIndex]) {
              // CHÌA KHÓA: Cứ có bài tập thì tự động đánh dấu là ngày TẬP (isRest = false)
              newWeeklyPlan[dayIndex].isRest = false;
              newWeeklyPlan[dayIndex].intensity = 'High';

              newWeeklyPlan[dayIndex].exercises.push({
                detailId: detail.detailId,
                exId: detail.exercise?.exId,
                name: detail.exercise?.exName || detail.exercise?.exerciseName || 'Bài tập',
                target: detail.exercise?.bodyPart?.partName || detail.exercise?.partName || 'Cơ bắp',
                sets: detail.assignedSets || 3,
                reps: detail.assignedReps || '10',
              });
            }
          });
        }

        // Bổ sung: Ép lại State isRest = true cho những ngày thực sự trống (0 bài tập)
        const finalWeeklyPlan = newWeeklyPlan.map((day: DailyPlan) => ({
          ...day,
          isRest: day.exercises.length === 0
        }));

        setWeeklyPlan(finalWeeklyPlan);
      }
    } catch (error) {
      console.error("Lỗi tải lịch tập:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchExerciseLibrary = async () => {
    try {
      // Gọi API lấy danh sách bài tập mà ông đã làm
      const response = await axiosClient.get('/exercisesBrowser');
      const mappedData = response.data.map((ex: any) => {

        // Logic AI giả lập: Tính Risk Score dựa trên độ khó (1-3)
        let riskScore = (ex.difficulty || 1) * 3;
        if (ex.caution && ex.caution.length > 0) riskScore += 1; // Nếu có chấn thương thì +1 điểm rủi ro
        if (riskScore > 10) riskScore = 10;

        return {
          id: ex.exerciseId || ex.exId,
          name: ex.exerciseName || ex.exName,
          target: ex.partName || ex.bodyPart?.partName || 'Cơ bắp',
          risk: riskScore,
          defaultSets: ex.difficulty === 1 ? 3 : 4, // Bài dễ tập 3 set, bài khó 4 set
          defaultReps: ex.difficulty === 1 ? '12-15' : '8-10'
        };
      });
      setExerciseLibrary(mappedData);
    } catch (error) {
      console.error("Lỗi tải thư viện bài tập:", error);
    }
  };

  useEffect(() => {
    fetchActivePlan();
    fetchExerciseLibrary(); // Tải sẵn thư viện bài tập ngầm
  }, []);

  // --- 2. XỬ LÝ GỌI API ---
  const handleGeneratePlan = async () => {
    const newPlanPayload = {
      planName: `Phác đồ ${genSplit} - AI Sinh Tự Động`,
      splitType: genSplit,
      planDetails: genDays.map((day, idx) => ({
        dayOfWeek: day,
        exerciseOrder: 1,
        assignedSets: 4,
        assignedReps: "10-12",
        // Lấy ngẫu nhiên ID bài tập đầu tiên trong thư viện để làm mẫu
        exercise: { exId: exerciseLibrary.length > 0 ? exerciseLibrary[0].id : 31 }
      }))
    };

    try {
      await axiosClient.post('/workout-plan/generate', newPlanPayload);
      setIsGeneratorOpen(false);
      fetchActivePlan();
    } catch (error) {
      alert("Lỗi khi sinh lịch AI!");
    }
  };

  const handleAddExercise = async (ex: any) => {
    let currentPlanId = activePlanId;

    // BƯỚC 1: TẠO BÌA LỊCH NẾU CHƯA CÓ
    if (!currentPlanId) {
      try {
        const blankPlanPayload = {
          planName: "Lịch tập tùy chỉnh",
          splitType: "Custom",
          planDetails: []
        };
        const response = await axiosClient.post('/workout-plan/generate', blankPlanPayload);
        currentPlanId = response.data.planId;
        setActivePlanId(currentPlanId);
      } catch (error) {
        console.error("Lỗi tạo lịch:", error);
        alert("Lỗi hệ thống khi tạo lịch mới!");
        return;
      }
    }

    // BƯỚC 2: GỬI API THÊM BÀI TẬP VÀ CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC
    try {
      const payload = {
        dayOfWeek: selectedDayId,
        exerciseOrder: activeDay.exercises.length + 1,
        assignedSets: ex.defaultSets,
        assignedReps: ex.defaultReps,
        workoutPlan: { planId: currentPlanId },
        exercise: { exId: ex.id }
      };

      // Gửi yêu cầu lên server
      const res = await axiosClient.post('/plan-details', payload);
      setIsAddExerciseOpen(false);

      // --- CHÌA KHÓA Ở ĐÂY: OPTIMISTIC UPDATE ---
      // Tự động nhét bài tập vào state mà không cần đợi fetch lại từ Server
      setWeeklyPlan(prevPlan => {
        // Clone state cũ ra để sửa
        const newPlan = JSON.parse(JSON.stringify(prevPlan));
        const dayIndex = newPlan.findIndex((d: DailyPlan) => d.dayId === selectedDayId);

        if (dayIndex !== -1) {
          newPlan[dayIndex].isRest = false; // Tắt trạng thái nghỉ ngay lập tức
          newPlan[dayIndex].intensity = 'High';

          // Nhét bài tập vừa thêm vào danh sách hiển thị
          newPlan[dayIndex].exercises.push({
            detailId: res.data.detailId || Date.now(), // Lấy detailId thật từ DB trả về
            exId: ex.id,
            name: ex.name,
            target: ex.target,
            sets: ex.defaultSets,
            reps: ex.defaultReps
          });
        }
        return newPlan;
      });

    } catch (error) {
      console.error("Lỗi khi thêm bài tập:", error);
      alert("Lỗi khi thêm bài tập vào cơ sở dữ liệu!");
    }
  };

  const handleRemoveExercise = async (detailId: number) => {
    try {
      // 1. Báo server xóa bài tập
      await axiosClient.delete(`/plan-details/${detailId}`);

      // 2. Tự động búng bài tập đó ra khỏi giao diện React
      setWeeklyPlan(prevPlan => {
        const newPlan = JSON.parse(JSON.stringify(prevPlan));
        for (let i = 0; i < newPlan.length; i++) {
          // Lọc bỏ bài tập có detailId vừa xóa
          newPlan[i].exercises = newPlan[i].exercises.filter((ex: any) => ex.detailId !== detailId);

          // Nếu xóa xong mà ngày đó trống trơn -> Bật lại trạng thái Nghỉ ngơi
          if (newPlan[i].exercises.length === 0) {
            newPlan[i].isRest = true;
          }
        }
        return newPlan;
      });

    } catch (error) {
      console.error("Lỗi xóa bài:", error);
    }
  };

  // --- HANDLERS PHỤ ---
  const handleExerciseClick = (exId: number) => navigate(`/exercises/${exId}`);
  const toggleGenDay = (dayId: number) => setGenDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId].sort());

  const handleToggleRestDay = (dayId: number) => {
    const dayData = weeklyPlan.find(d => d.dayId === dayId);
    if (dayData && dayData.exercises.length > 0 && !dayData.isRest) {
      alert("Vui lòng xóa hết bài tập trong ngày trước khi chuyển sang trạng thái Nghỉ Ngơi!");
      return;
    }

    setWeeklyPlan(prevPlan => prevPlan.map(day => day.dayId === dayId ? { ...day, isRest: !day.isRest } : day));
  };

  const handleExport = (method: 'download' | 'email') => {
    alert(`Đang xử lý ${method === 'download' ? 'tải xuống' : 'gửi email'}...`);
    setIsExportOpen(false);
  };

  const getRiskUI = (risk: number) => {
    if (risk <= 3) return { color: 'bg-emerald-500', text: 'SAFE', bg: 'bg-emerald-50 border-emerald-100' };
    if (risk <= 6) return { color: 'bg-yellow-500', text: 'CAUTION', bg: 'bg-yellow-50 border-yellow-100' };
    return { color: 'bg-[#e22718]', text: 'DANGER', bg: 'bg-red-50 border-red-200' };
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#e22718]"><i className="fa-solid fa-circle-notch fa-spin text-4xl"></i></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-slate-900 font-sans relative">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="border-b border-gray-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              Weekly_Workout_<span className="text-[#e22718]">Plan_</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1">
              Phác đồ tập luyện tùy biến thông minh
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button onClick={() => setIsExportOpen(true)} className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm">
              <i className="fa-solid fa-file-export mr-2 text-sm"></i> Xuất Lịch Tập
            </button>
            <button onClick={() => navigate('/bodyDiag')} className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-white border-2 border-[#e22718] text-[#e22718] hover:bg-[#e22718] hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm group">
              <i className="fa-solid fa-street-view mr-2 text-sm group-hover:animate-pulse"></i> Bio-Scan_Chấn_Thương_
            </button>
            <button onClick={() => setIsGeneratorOpen(true)} className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-[#e22718] border-2 border-[#e22718] text-white hover:bg-red-700 hover:border-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md shadow-red-500/20">
              <i className="fa-solid fa-wand-magic-sparkles mr-2 text-sm"></i> Sinh Lịch AI
            </button>
          </div>
        </header>

        {/* BẢNG OVERVIEW 7 NGÀY */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {weeklyPlan.map((item) => {
              const isSelected = item.dayId === selectedDayId;
              const hasExercises = item.exercises.length > 0;

              const activeBg = item.isRest ? 'bg-emerald-50/50' : 'bg-red-50/50';
              const activeBorder = item.isRest ? 'border-t-emerald-500' : 'border-t-[#e22718]';
              const activeText = item.isRest ? 'text-emerald-600' : 'text-[#e22718]';
              const unselectedText = hasExercises ? 'text-slate-700' : 'text-slate-400 font-medium';

              return (
                <div key={item.dayId} onClick={() => setSelectedDayId(item.dayId)}
                  className={`relative p-6 flex flex-col items-center justify-center h-full cursor-pointer transition-all ${isSelected ? `${activeBg} border-t-4 ${activeBorder} shadow-inner` : 'hover:bg-slate-50'
                    } ${item.isRest && !isSelected ? 'opacity-60 bg-slate-100/50' : ''}`}
                  style={{ marginTop: isSelected ? '-4px' : '0' }}
                >
                  <span className={`text-sm uppercase tracking-widest ${isSelected ? `font-black ${activeText}` : `font-bold ${unselectedText}`}`}>
                    {item.dayName}
                  </span>
                  {!item.isRest && (
                    <div className="absolute bottom-2 flex space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${hasExercises ? 'bg-[#e22718]' : 'bg-transparent'}`}></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CHI TIẾT LỊCH TẬP CỦA NGÀY ĐƯỢC CHỌN */}
        <section className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden relative">
          <div className={`p-6 border-b flex justify-between items-center transition-colors duration-300 ${activeDay.isRest ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-gray-100'}`}>
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-colors ${activeDay.isRest ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-gray-200 text-slate-800'}`}>
                {activeDay.isRest ? <i className="fa-solid fa-mug-hot"></i> : <i className="fa-solid fa-stopwatch"></i>}
              </div>
              <div>
                <h2 className={`text-2xl font-black uppercase italic tracking-tight transition-colors ${activeDay.isRest ? 'text-emerald-800' : 'text-slate-900'}`}>
                  {activeDay.dayName} {activeDay.isRest ? '- Nghỉ Ngơi' : '- Tập Luyện'}
                </h2>
                {!activeDay.isRest && (
                  <div className="flex items-center space-x-6 mt-2">
                    <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider"><i className="fa-solid fa-list-check mr-1.5 text-slate-400"></i> {totalExercises} Bài tập</p>
                    <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider"><i className="fa-solid fa-layer-group mr-1.5 text-slate-400"></i> {totalSets} Sets</p>
                    <p className="text-[11px] text-[#e22718] font-black uppercase tracking-wider bg-red-50 px-2 py-1 rounded"><i className="fa-regular fa-clock mr-1.5"></i> ~{estimatedTime} Phút</p>
                  </div>
                )}
                {activeDay.isRest && <p className="text-xs text-emerald-600 font-semibold uppercase tracking-widest mt-1">Cơ bắp cần thời gian phục hồi</p>}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {!activeDay.isRest && (
                <button onClick={() => setIsAddExerciseOpen(true)} className="border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:border-slate-800 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md">
                  <i className="fa-solid fa-plus mr-2"></i> Thêm bài
                </button>
              )}
              <div className="flex items-center space-x-3 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm cursor-pointer" onClick={() => handleToggleRestDay(activeDay.dayId)}>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeDay.isRest ? 'text-emerald-600' : 'text-slate-400'}`}>Nghỉ</span>
                <button className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${!activeDay.isRest ? 'bg-slate-900' : 'bg-emerald-400'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${!activeDay.isRest ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!activeDay.isRest ? 'text-slate-900' : 'text-slate-400'}`}>Tập</span>
              </div>
            </div>
          </div>

          <div className="p-6 transition-all duration-500">
            {activeDay.isRest ? (
              <div className="py-16 flex flex-col items-center justify-center text-emerald-600/60 animate-in fade-in zoom-in duration-300">
                <i className="fa-solid fa-battery-full text-6xl mb-6"></i>
                <p className="text-base font-black uppercase tracking-[0.2em]">Cơ thể đang sạc lại năng lượng</p>
                <p className="text-xs font-semibold text-emerald-600/50 mt-2">Ngày này không có lịch trình tập luyện.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                {activeDay.exercises.length === 0 ? (
                  <div className="col-span-2 py-10 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <i className="fa-solid fa-box-open text-4xl mb-3"></i>
                    <p className="text-sm font-semibold">Chưa có bài tập nào. Hãy bấm "Thêm bài" nhé!</p>
                  </div>
                ) : (
                  activeDay.exercises.map((ex, index) => (
                    <div key={ex.detailId} className="group flex items-center p-4 rounded-xl border border-gray-100 bg-white hover:border-[#e22718] hover:shadow-md transition-all relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-red-50 group-hover:text-[#e22718] transition-colors shrink-0">
                        {index + 1}
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#e22718] transition-colors mb-1.5 cursor-pointer" onClick={() => handleExerciseClick(ex.exId)}>{ex.name}</h4>
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-black tracking-tighter">{ex.target}</span>
                          <span className="text-[11px] font-bold text-slate-500"><i className="fa-solid fa-layer-group mr-1 text-slate-300"></i> {ex.sets} Sets ({ex.reps})</span>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveExercise(ex.detailId)} className="absolute right-4 p-2 text-slate-300 hover:text-[#e22718] transition-colors opacity-0 group-hover:opacity-100" title="Xóa khỏi lịch">
                        <i className="fa-solid fa-trash-can text-lg"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* --- OVERLAY MODAL: EXPORT CENTER --- */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-black uppercase italic tracking-tighter">Export_Center <i className="fa-solid fa-box-archive text-[#e22718] ml-2"></i></h3>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Đóng gói và chia sẻ lịch tập</p>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="text-slate-400 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">1. Chọn định dạng xuất file</label>
                <div className="space-y-3">
                  {[
                    { id: 'PDF', icon: 'fa-file-pdf', name: 'Tài liệu PDF', desc: 'Bản in chuyên nghiệp, giữ nguyên định dạng.' },
                    { id: 'EXCEL', icon: 'fa-file-excel', name: 'Bảng tính Excel', desc: 'Dữ liệu thô để tự nhập log và theo dõi.' }
                  ].map(fmt => (
                    <div key={fmt.id} onClick={() => setExportFormat(fmt.id)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center ${exportFormat === fmt.id ? 'border-[#e22718] bg-red-50' : 'border-gray-100 hover:border-gray-300'}`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${exportFormat === fmt.id ? 'bg-[#e22718] text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <i className={`fa-solid ${fmt.icon}`}></i>
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className={`text-sm font-black uppercase ${exportFormat === fmt.id ? 'text-[#e22718]' : 'text-slate-700'}`}>{fmt.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</p>
                      </div>
                      {exportFormat === fmt.id && <i className="fa-solid fa-circle-check text-[#e22718] text-lg ml-2"></i>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex gap-3">
              <button onClick={() => handleExport('download')} className="flex-1 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center">
                <i className="fa-solid fa-download mr-2"></i> Tải về máy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- OVERLAY MODAL: THÊM BÀI TẬP TỪ DATABASE --- */}
      {isAddExerciseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-black uppercase text-slate-900">Thêm bài tập</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Vào <span className="text-[#e22718] font-bold">{activeDay.dayName}</span></p>
              </div>
              <button onClick={() => setIsAddExerciseOpen(false)} className="text-slate-400 hover:text-slate-800"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-4 bg-white flex-grow overflow-y-auto space-y-3">
              {exerciseLibrary.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-mono text-xs uppercase tracking-widest">
                  <i className="fa-solid fa-spinner fa-spin text-2xl mb-3 text-[#e22718]"></i>
                  <br />Đang tải thư viện từ Server...
                </div>
              ) : (
                exerciseLibrary.map(ex => {
                  const ui = getRiskUI(ex.risk);
                  const isDanger = ex.risk > 7;
                  return (
                    <div key={ex.id} className={`p-4 border rounded-xl flex items-center justify-between ${ui.bg} transition-all`}>
                      <div className="flex-grow pr-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`text-sm font-black ${isDanger ? 'text-[#e22718]' : 'text-slate-800'}`}>{ex.name}</h4>
                          <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white shadow-sm border border-slate-100">{ex.target}</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1 opacity-80">
                            <span>Risk Level</span><span>{ui.text} ({ex.risk}/10)</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/60 rounded-full overflow-hidden">
                            <div className={`h-full ${ui.color}`} style={{ width: `${ex.risk * 10}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleAddExercise(ex)} className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-lg transition-all shadow-sm ${isDanger ? 'border-2 border-[#e22718] text-[#e22718] hover:bg-[#e22718] hover:text-white' : 'bg-slate-900 text-white hover:bg-[#e22718] hover:border-[#e22718]'}`}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- OVERLAY MODAL: AI GENERATOR CONFIG --- */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-black uppercase italic tracking-tighter">Generator_Config <i className="fa-solid fa-sliders text-[#e22718] ml-2"></i></h3>
              </div>
              <button onClick={() => setIsGeneratorOpen(false)} className="text-slate-400 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">1. Chọn ngày tập trong tuần</label>
                <div className="flex justify-between gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <button key={day.id} onClick={() => toggleGenDay(day.id)} className={`flex-1 aspect-square rounded-lg text-xs font-black transition-all border-2 ${genDays.includes(day.id) ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-gray-200 text-slate-400 hover:border-slate-400'}`}>
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">2. Định hướng chia nhóm cơ</label>
                <div className="space-y-2">
                  {SPLIT_OPTIONS.map(split => (
                    <div key={split.id} onClick={() => setGenSplit(split.id)} className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${genSplit === split.id ? 'border-[#e22718] bg-red-50' : 'border-gray-100 hover:border-gray-300'}`}>
                      <div>
                        <h4 className={`text-sm font-black uppercase ${genSplit === split.id ? 'text-[#e22718]' : 'text-slate-700'}`}>{split.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{split.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end space-x-3">
              <button onClick={() => setIsGeneratorOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">HỦY</button>
              <button onClick={handleGeneratePlan} className="bg-[#e22718] hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center transition-colors shadow-md shadow-red-500/20">
                <i className="fa-solid fa-bolt mr-2"></i> Tạo Lịch Mới
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkoutPlan;