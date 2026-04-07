import React, { useState, useEffect, type ChangeEvent } from 'react';
import axiosClient from '../api/axiosClient';
import type { UserBodyResponse } from '../types/bodyMetric';

const userId = 1; 

const BodyMetricsLab: React.FC = () => {
  const [formData, setFormData] = useState<UserBodyResponse>({
    userName: "",
    age: 0,
    gender: "Male",
    height: 0,
    weight: 0,
    bodyfatPerc: null,
    smm: null,
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
      [name]: numericFields.includes(name) ? (value === "" ? null : parseFloat(value)) : value
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

  if (isLoading) return <div className="text-[#e22718] p-10 font-black italic animate-pulse">INITIALIZING_LAB_SYSTEMS...</div>;

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-[#e5e7eb] font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white">
            Body <span className="text-[#e22718]">Metrics Lab_</span>
          </h1>
          <div className="flex space-x-3">
            <button 
              onClick={handleConfirm}
              className="px-8 py-2 text-[10px] font-black bg-[#e22718] hover:bg-red-700 text-white rounded transition-all uppercase tracking-[0.2em] shadow-lg shadow-red-900/20"
            >
              Confirm_Params_
            </button>
          </div>
        </header>

        {/* Thay đổi tỉ lệ grid thành 7:5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: FORM NHẬP LIỆU (7 PHẦN) */}
          <form className="lg:col-span-7 space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cá nhân */}
              <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 space-y-4 border-t-2 border-t-[#e22718]">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Personal_Info</h3>
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase mb-1">Họ và tên</label>
                  <input name="userName" value={formData.userName} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white focus:border-[#e22718] outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase mb-1">Tuổi</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase mb-1">Giới tính</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white outline-none">
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Chỉ số InBody */}
              <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">InBody_Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase mb-1">Cao (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border-l-2 border-l-blue-600 border-y-[#333] border-r-[#333] rounded text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase mb-1">Nặng (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border-l-2 border-l-blue-600 border-y-[#333] border-r-[#333] rounded text-sm text-white outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase mb-1">Fat (%)</label>
                    <input type="number" name="bodyfatPerc" value={formData.bodyfatPerc || ""} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border border-dashed border-[#444] rounded text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase mb-1">SMM (kg)</label>
                    <input type="number" name="smm" value={formData.smm || ""} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border border-dashed border-[#444] rounded text-sm text-white outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lối sống & Mục tiêu */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 space-y-5">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Strategy_Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-[9px] text-gray-500 uppercase mb-1">Mức độ vận động</label>
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-xs text-white outline-none">
                    <option value="sedentary">Ít vận động</option>
                    <option value="lightly active">Vận động nhẹ</option>
                    <option value="moderately active">Vận động vừa</option>
                    <option value="very active">Vận động nhiều</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase mb-1">Mục tiêu</label>
                  <select name="target" value={formData.target} onChange={handleChange} className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-xs text-white outline-none">
                    <option value="lose weight">Giảm cân</option>
                    <option value="maintain">Duy trì</option>
                    <option value="gain muscle">Tăng cơ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase mb-1">Cường độ</label>
                  <select 
                    name="targetIntensity" 
                    value={formData.targetIntensity} 
                    onChange={handleChange} 
                    disabled={formData.target === 'maintain'}
                    className={`w-full p-2 bg-[#1a1a1a] border rounded text-xs text-white outline-none transition-all 
                      ${formData.target === 'maintain' ? 'opacity-20 border-gray-800' : 'border-[#333] focus:border-[#e22718]'}`}
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
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px]">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <i className="fa-solid fa-microscope text-6xl text-white"></i>
              </div>

              <div className="text-center z-10">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] mb-4">Diagnostic_Result</p>
                
                {/* BMI Circle */}
                <div className="w-32 h-32 rounded-full border-4 border-gray-800 flex items-center justify-center mb-6 relative">
                  <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin-slow ${formData.bmi < 25 ? 'border-blue-500' : 'border-red-500'}`} style={{animationDuration: '3s'}}></div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-white">{formData.bmi}</p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase">BMI Index</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest ${formData.bmi < 25 ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                    {formData.bmi < 25 ? 'Status: Normal' : 'Status: High Risk'}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Active_Strategy</p>
                    <p className="text-sm font-bold text-white uppercase italic tracking-tighter">
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