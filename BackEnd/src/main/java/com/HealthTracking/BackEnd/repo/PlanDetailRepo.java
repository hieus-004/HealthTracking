package com.HealthTracking.BackEnd.repo;

import com.HealthTracking.BackEnd.model.PlanDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanDetailRepo extends JpaRepository<PlanDetail, Integer> {
    
    // Tìm tất cả bài tập trong 1 Lịch cụ thể + Trong 1 ngày cụ thể -> Sắp xếp theo thứ tự tập
    List<PlanDetail> findByWorkoutPlan_PlanIdAndDayOfWeekOrderByExerciseOrderAsc(Integer planId, Integer dayOfWeek);
    
}