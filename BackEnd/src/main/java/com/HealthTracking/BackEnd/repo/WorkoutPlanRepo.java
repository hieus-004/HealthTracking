package com.HealthTracking.BackEnd.repo;

import com.HealthTracking.BackEnd.model.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutPlanRepo extends JpaRepository<WorkoutPlan, Integer> {
    
    // Tìm lịch đang Active của một User cụ thể
    // Giả sử khóa chính của bảng User tên là "userId"
    Optional<WorkoutPlan> findByUser_UserIdAndIsActiveTrue(Integer userId);
}