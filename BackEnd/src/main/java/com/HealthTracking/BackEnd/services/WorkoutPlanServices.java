package com.HealthTracking.BackEnd.services;

import com.HealthTracking.BackEnd.model.PlanDetail;
import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.WorkoutPlan;
import com.HealthTracking.BackEnd.repo.WorkoutPlanRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class WorkoutPlanServices {

    @Autowired
    private WorkoutPlanRepo workoutPlanRepository;

    // 1. LẤY LỊCH TẬP ĐANG ACTIVE CỦA USER
    public WorkoutPlan getActivePlanByUserId(Integer userId) {
        return workoutPlanRepository.findByUser_UserIdAndIsActiveTrue(userId).orElse(null);
    }

    // 2. LƯU LỊCH MỚI VÀ TẮT LỊCH CŨ
    @Transactional
    public WorkoutPlan saveNewActivePlan(Integer userId, WorkoutPlan newPlan) {
        
        // BƯỚC 1: Tìm xem User này có lịch nào đang chạy không
        Optional<WorkoutPlan> oldPlanOpt = workoutPlanRepository.findByUser_UserIdAndIsActiveTrue(userId);
        
        // BƯỚC 2: Nếu có, "Tắt" nó đi (Set isActive = false)
        if (oldPlanOpt.isPresent()) {
            WorkoutPlan oldPlan = oldPlanOpt.get();
            oldPlan.setIsActive(false);
            workoutPlanRepository.save(oldPlan);
        }

        // BƯỚC 3: Khởi tạo thông tin cho lịch mới
        User user = new User();
        user.setUserId(userId); // Tạo object User giả lập chỉ chứa ID để map khóa ngoại
        
        newPlan.setUser(user);
        newPlan.setIsActive(true);
        newPlan.setDate(LocalDate.now()); // Dùng LocalDate theo đúng Model của ông

        // BƯỚC 4: Ràng buộc khóa ngoại 2 chiều cho PlanDetail (Bắt buộc phải có để tránh lỗi Null ForeignKey)
        if (newPlan.getPlanDetails() != null) {
            for (PlanDetail detail : newPlan.getPlanDetails()) {
                detail.setWorkoutPlan(newPlan);
            }
        }

        // BƯỚC 5: Lưu lịch mới (Tự động lưu luôn cả PlanDetail nhờ CascadeType.ALL)
        return workoutPlanRepository.save(newPlan);
    }
}