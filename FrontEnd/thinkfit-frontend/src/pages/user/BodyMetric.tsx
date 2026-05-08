import React, { useState, useEffect, type ChangeEvent } from 'react';
import axiosClient from '../../api/axiosClient';
import type { UserBodyResponse } from '../../types/bodyMetric';

const userId = 1; 

const BodyMetricsLab: React.FC = () => {
  const [formData, setFormData] = useState<UserBodyResponse>({
    userName: "",
    age: 0,
    gender: "Male",
    height: 0,
    weight: 0,
    bodyfatPerc: 0,
    smm: 0,
    activityLevel: "moderately active",
    target: "lose weight",
    targetIntensity: "balanced",
    bmi: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBodyInfo = async () => {
      try {
        const data = await axiosClient.get<UserBodyResponse>(`/user/${userId}/bodyInfo`);
        if (data.data) {
          setFormData({
            ...data.data,
            targetIntensity: (data.data as any).targetIntensity || "balanced"
          });
        }
      } catch (error) {
        console.error("Không thể lấy dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBodyInfo();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["height", "weight", "age", "bodyfatPerc", "smm"];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value === "" ? 0 : parseFloat(value)) : value
    }));
  };

  const handleConfirm = async () => {
    try {
      const response = await axiosClient.post<UserBodyResponse>(`/user/${userId}/bodyInfo`, formData);
      setFormData({
        ...response.data,
        targetIntensity: (response.data as any).targetIntensity || formData.targetIntensity
      });
      alert("Cập nhật thông số thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  if (isLoading) return <div className="text-[#e22718] p-10 font-black italic animate-pulse flex justify-center">INITIALIZING_LAB_SYSTEMS...</div>;

  return (
    // Đổi nền chính thành gray-50 và chữ mặc định thành slate-800
    <div className="min-h-screen p-6 bg-gray-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header viền dưới màu gray-200 */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">
            Body <span className="text-[#e22718]">Metrics Lab_</span>
          </h1>
          <div className="flex space-x-3">
            <button 
              onClick={handleConfirm}
              // Bóng mờ (shadow) được làm sáng hơn một chút cho hợp light theme
              className="px-8 py-2 text-[10px] font-black bg-[#e22718] hover:bg-red-700 text-white rounded transition-all uppercase tracking-[0.2em] shadow-md shadow-red-500/20"
            >
              Confirm_Params_
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: FORM NHẬP LIỆU (7 PHẦN) */}
          <form className="lg:col-span-7 space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cá nhân */}
              {/* Box nền trắng, viền xám nhạt, có shadow */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 space-y-4 border-t-2 border-t-[#e22718]">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Personal_Info</h3>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1">Họ và tên</label>
                  {/* Input đổi nền thành slate-50, chữ slate-800 */}
                  <input name="userName" value={formData.userName} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-gray-200 rounded text-sm text-slate-800 focus:border-[#e22718] outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">Tuổi</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-gray-200 rounded text-sm text-slate-800 focus:border-[#e22718] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">Giới tính</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-gray-200 rounded text-sm text-slate-800 focus:border-[#e22718] outline-none transition-colors">
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Chỉ số InBody */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 space-y-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">InBody_Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">Cao (cm)</label>
                    {/* Viền trái màu xanh, các viền còn lại xám nhạt */}
                    <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-2 bg-slate-50 border-l-2 border-l-blue-500 border-y-gray-200 border-r-gray-200 rounded text-sm text-slate-800 focus:border-r-[#e22718] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">Nặng (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 bg-slate-50 border-l-2 border-l-blue-500 border-y-gray-200 border-r-gray-200 rounded text-sm text-slate-800 focus:border-r-[#e22718] outline-none transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">Fat (%)</label>
                    {/* Viền đứt khúc màu xám (gray-300) */}
                    <input type="number" name="bodyfatPerc" value={formData.bodyfatPerc || ""} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-dashed border-gray-300 rounded text-sm text-slate-800 focus:border-[#e22718] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase mb-1">SMM (kg)</label>
                    <input type="number" name="smm" value={formData.smm || ""} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-dashed border-gray-300 rounded text-sm text-slate-800 focus:border-[#e22718] outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lối sống & Mục tiêu */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 space-y-5">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strategy_Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-[9px] text-slate-500 uppercase mb-1">Mức độ vận động</label>
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-gray-200 rounded text-xs text-slate-800 focus:border-[#e22718] outline-none transition-colors">
                    <option value="sedentary">Ít vận động</option>
                    <option value="lightly active">Vận động nhẹ</option>
                    <option value="moderately active">Vận động vừa</option>
                    <option value="very active">Vận động nhiều</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1">Mục tiêu</label>
                  <select name="target" value={formData.target} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-gray-200 rounded text-xs text-slate-800 focus:border-[#e22718] outline-none transition-colors">
                    <option value="lose weight">Giảm cân</option>
                    <option value="maintain">Duy trì</option>
                    <option value="gain muscle">Tăng cơ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1">Cường độ</label>
                  <select 
                    name="targetIntensity" 
                    value={formData.targetIntensity} 
                    onChange={handleChange} 
                    disabled={formData.target === 'maintain'}
                    // Xử lý màu sắc khi bị disable (làm mờ, đổi màu nền)
                    className={`w-full p-2 rounded text-xs outline-none transition-all 
                      ${formData.target === 'maintain' 
                        ? 'opacity-50 border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-slate-50 border border-gray-200 text-slate-800 focus:border-[#e22718]'}`}
                  >
                    <option value="balanced">Cân bằng</option>
                    <option value="fast">Nhanh</option>
                    <option value="aggressive">Mạnh mẽ</option>
                  </select>
                </div>
              </div>
            </div>
          </form>

          {/* CỘT PHẢI: PHÂN TÍCH NHỎ GỌN (5 PHẦN) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px]">
              {/* Background Decoration (Icon) đổi sang màu xám siêu nhạt */}
              <div className="absolute top-0 right-0 p-2 opacity-30">
                <i className="fa-solid fa-microscope text-6xl text-slate-200"></i>
              </div>

              <div className="text-center z-10">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mb-4">Diagnostic_Result</p>
                
                {/* BMI Circle */}
                {/* Viền ngoài đổi sang gray-100 để không quá tối */}
                <div className="w-32 h-32 rounded-full border-4 border-gray-100 flex items-center justify-center mb-6 relative">
                  <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin-slow ${formData.bmi < 25 ? 'border-blue-500' : 'border-red-500'}`} style={{animationDuration: '3s'}}></div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-slate-900">{formData.bmi}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">BMI Index</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Badge Status - Đổi màu nền sáng hơn (blue-50/red-50) và viền nhạt (blue-200/red-200) */}
                  <div className={`px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                    formData.bmi < 25 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {formData.bmi < 25 ? 'Status: Normal' : 'Status: High Risk'}
                  </div>
                  
                  {/* Đường kẻ chia cách đổi sang gray-200 */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Active_Strategy</p>
                    <p className="text-sm font-bold text-slate-900 uppercase italic tracking-tighter">
                      {formData.target} <span className="text-[#e22718]">@{formData.targetIntensity}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BodyMetricsLab;