package com.HealthTracking.BackEnd.controller;

import com.HealthTracking.BackEnd.model.WorkoutPlan;
import com.HealthTracking.BackEnd.services.WorkoutPlanServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workout-plan")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanServices workoutPlanService;

    // Giả lập ID của User đang đăng nhập (Sau này ông thay bằng JWT Token nhé)
    private final Integer CURRENT_USER_ID = 1; 

    @GetMapping("/active")
    public ResponseEntity<?> getActiveWorkoutPlan() {
        try {
            WorkoutPlan activePlan = workoutPlanService.getActivePlanByUserId(CURRENT_USER_ID);
            if (activePlan == null) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Chưa có lịch tập nào.");
            }
            return ResponseEntity.ok(activePlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<?> createNewWorkoutPlan(@RequestBody WorkoutPlan newPlan) {
        try {
            WorkoutPlan savedPlan = workoutPlanService.saveNewActivePlan(CURRENT_USER_ID, newPlan);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }
}