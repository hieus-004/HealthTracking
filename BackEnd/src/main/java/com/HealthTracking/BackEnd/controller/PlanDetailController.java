package com.HealthTracking.BackEnd.controller;

import com.HealthTracking.BackEnd.model.PlanDetail;
import com.HealthTracking.BackEnd.services.PlanDetailServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plan-details")
public class PlanDetailController {

    @Autowired
    private PlanDetailServices planDetailService;

    // Lấy bài tập của 1 ngày (VD: Lấy lịch Thứ 2 của Lịch tập số 1)
    // GET: /api/plan-details/plan/1/day/2
    @GetMapping("/plan/{planId}/day/{dayOfWeek}")
    public ResponseEntity<?> getExercisesByDay(@PathVariable Integer planId, @PathVariable Integer dayOfWeek) {
        try {
            List<PlanDetail> exercises = planDetailService.getDetailsByPlanAndDay(planId, dayOfWeek);
            return ResponseEntity.ok(exercises);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    // Thêm 1 bài tập đơn lẻ vào ngày
    // POST: /api/plan-details
    @PostMapping
    public ResponseEntity<?> addExercise(@RequestBody PlanDetail planDetail) {
        try {
            PlanDetail savedDetail = planDetailService.addExerciseToDay(planDetail);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDetail);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi thêm bài: " + e.getMessage());
        }
    }

    // Sửa Sets & Reps
    // PUT: /api/plan-details/15
    // Body (JSON): { "assignedSets": 4, "assignedReps": "10-12" }
    @PutMapping("/{detailId}")
    public ResponseEntity<?> updateExerciseConfig(@PathVariable Integer detailId, @RequestBody Map<String, Object> updates) {
        try {
            Integer sets = (Integer) updates.get("assignedSets");
            String reps = (String) updates.get("assignedReps");
            
            PlanDetail updatedDetail = planDetailService.updateSetsAndReps(detailId, sets, reps);
            return ResponseEntity.ok(updatedDetail);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // Xóa 1 bài tập
    // DELETE: /api/plan-details/15
    @DeleteMapping("/{detailId}")
    public ResponseEntity<?> deleteExercise(@PathVariable Integer detailId) {
        try {
            planDetailService.removeExerciseFromPlan(detailId);
            return ResponseEntity.ok("Đã xóa bài tập khỏi lịch thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xóa bài: " + e.getMessage());
        }
    }
}