import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard'; // Trang Dashboard cũ
import BodyMetricsLab from './pages/BodyMetric'; // Trang bạn vừa làm
import BodyEvolution from './pages/BodyEvolution';
import MuscleTargeting from './pages/MuscleTargeting';
import NutritionTracker from './pages/NutritionTracker';
import ExerciseBrowser from './pages/ExerciseBrowser';
import ExerciseDetail from './pages/ExerciseDetail';
import BodyDiagnostic from './pages/BodyDiag';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mọi Route bên trong này đều sẽ có Sidebar và Header */}
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;