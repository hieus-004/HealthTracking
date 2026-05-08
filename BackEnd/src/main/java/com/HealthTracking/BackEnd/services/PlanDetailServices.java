package com.HealthTracking.BackEnd.services;

import com.HealthTracking.BackEnd.model.PlanDetail;
import com.HealthTracking.BackEnd.repo.PlanDetailRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanDetailServices {

    @Autowired
    private PlanDetailRepo planDetailRepository;

    // 1. Lấy danh sách bài tập theo Ngày trong tuần của 1 Lịch
    public List<PlanDetail> getDetailsByPlanAndDay(Integer planId, Integer dayOfWeek) {
        return planDetailRepository.findByWorkoutPlan_PlanIdAndDayOfWeekOrderByExerciseOrderAsc(planId, dayOfWeek);
    }

    // 2. Thêm bài tập mới vào một ngày
    public PlanDetail addExerciseToDay(PlanDetail newDetail) {
        // Lưu dữ liệu chỉ có ID vào DB
        PlanDetail savedDetail = planDetailRepository.save(newDetail);
        
        // MẸO: Gọi lệnh findById để ép Spring Boot chui vào DB lấy full dữ liệu ra
        return planDetailRepository.findById(savedDetail.getDetailId()).orElse(savedDetail);
    }

    // 3. Cập nhật Số Hiệp (Sets) và Số Lần (Reps)
    public PlanDetail updateSetsAndReps(Integer detailId, Integer newSets, String newReps) {
        PlanDetail existingDetail = planDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết bài tập này!"));
        
        existingDetail.setAssignedSets(newSets);
        existingDetail.setAssignedReps(newReps);
        
        return planDetailRepository.save(existingDetail);
    }

    // 4. Xóa một bài tập khỏi lịch
    public void removeExerciseFromPlan(Integer detailId) {
        planDetailRepository.deleteById(detailId);
    }
}