import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Imports Layouts ---
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout'; // Import thêm AdminLayout

// --- Imports Pages (User) ---
import Dashboard from './pages/user/Dashboard';
import BodyMetricsLab from './pages/user/BodyMetric';
import BodyEvolution from './pages/user/BodyEvolution';
import MuscleTargeting from './pages/user/MuscleTargeting';
import NutritionTracker from './pages/user/NutritionTracker';
import ExerciseBrowser from './pages/user/ExerciseBrowser';
import ExerciseDetail from './pages/user/ExerciseDetail';
import BodyDiagnostic from './pages/user/BodyDiag';
import RecoveryDeepDive from './pages/user/RecoveryDeepDive';
import WorkoutPlan from './pages/user/WorkoutPlan';
import AuthPage from './pages/user/AuthPage';

import AdminDashboard from './pages/admin/AdminDashBoard';
import UserManagement from './pages/admin/UserManagement';
import ExerciseManagement from './pages/admin/ExerciseManagement';
import BodyPartManagement from './pages/admin/BodyPartManagement';
import FoodManagement from './pages/admin/FoodManagement';
import JointManagement from './pages/admin/JointManagement';

// --- Imports Pages (Admin) ---
// Tạm thời import hoặc định nghĩa các placeholder, sau này ông trỏ file thật vào nhé
// import AdminDashboard from './pages/admin/AdminDashboard';
// import UserManagement from './pages/admin/UserManagement';
// ...

// ==========================================
// HÀM KIỂM TRA QUYỀN VÀ BẢO VỆ ROUTE ADMIN
// ==========================================
const isAdmin = () => {
  // Thực tế ông sẽ check role từ localStorage hoặc token payload ở đây
  const role = localStorage.getItem('role');
  // Tạm thời trả về true để ông test UI dễ dàng, khi ghép API thì mở logic này ra:
  // return role === 'ADMIN'; 
  return true; 
};

// Component chặn cửa: Nếu không phải Admin thì đá về trang Login
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            LUỒNG 1: TRANG ĐỘC LẬP (KHÔNG LAYOUT)
            ========================================== */}
        <Route path="/login" element={<AuthPage />} />

        {/* ==========================================
            LUỒNG 2: DÀNH CHO NGƯỜI DÙNG (Kèm MainLayout)
            ========================================== */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="metrics" element={<BodyMetricsLab />} />
          <Route path="evolution" element={<BodyEvolution />} />
          <Route path="muscleTarget" element={<MuscleTargeting />} />
          <Route path="nutrition" element={<NutritionTracker />} />
          <Route path="settings" element={<div>Settings Page</div>} />
          <Route path="exercises" element={<ExerciseBrowser />} />
          <Route path="exercises/:id" element={<ExerciseDetail />} />
          <Route path="bodyDiag" element={<BodyDiagnostic />} />
          <Route path="recoveryChart" element={<RecoveryDeepDive />} />
          <Route path="workoutPlan" element={<WorkoutPlan />} />
        </Route>

        {/* ==========================================
            LUỒNG 3: DÀNH CHO ADMIN (Kèm AdminLayout & Bảo vệ)
            ========================================== */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Dashboard Thống kê */}
          <Route index element={<AdminDashboard />} />
          
          {/* Các trang quản lý CRUD */}
          <Route path="users" element={<UserManagement />} />
          <Route path="exercises" element={<ExerciseManagement />} />
          <Route path="body-parts" element={<BodyPartManagement />} />
          <Route path="foods" element={<FoodManagement />} />
          <Route path="joints" element={<JointManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;