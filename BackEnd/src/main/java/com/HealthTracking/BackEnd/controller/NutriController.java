package com.HealthTracking.BackEnd.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.dto.DailyMacroResponse;
import com.HealthTracking.BackEnd.model.dto.FoodLogRequest;
import com.HealthTracking.BackEnd.model.dto.MealLogResponse;
import com.HealthTracking.BackEnd.model.dto.MealUpdateRequest;
import com.HealthTracking.BackEnd.model.dto.WeeklyMacroResponse;
import com.HealthTracking.BackEnd.model.dto.WeightRangeResponse;
import com.HealthTracking.BackEnd.services.ChatBotServices;
import com.HealthTracking.BackEnd.services.DailyMacroServices;
import com.HealthTracking.BackEnd.services.NutriServices;

@RestController
@RequestMapping("/api")
public class NutriController {

    @Autowired
    private NutriServices nutriServices;

    @Autowired
    private ChatBotServices chatBotServices;

    @Autowired 
    private DailyMacroServices dailyMacroServices;

    @GetMapping("nutri/{id}/recommendCalories")
    public DailyMacroResponse getRcmdCalories(@PathVariable Integer id) {
        return nutriServices.getRecommendedCalories(id);
    }

    @GetMapping("nutri/{id}/weightRange")
    public WeightRangeResponse getWeightRange(@PathVariable Integer id) {
        return nutriServices.getWeightRange(id);
    }

    @PostMapping("nutri/chatbot/{id}")
    public String chatbotNutri(@RequestBody String message, @PathVariable Integer id) {
        return chatBotServices.chatBotInvoke(message, id);
    }

    @GetMapping("nutri/todayMacro/{id}")
    public DailyMacroResponse getTodayMacro(@PathVariable Integer id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        System.out.println(targetDate);
        return nutriServices.getTodayMacro(id, date);
    }

    @PutMapping("nutri/sync/{id}")
    public String upsertFoodLog(@PathVariable Integer id) {
        return nutriServices.upsertFoodLog(id);
    }

    @GetMapping("nutri/todayLogs/{id}")
    public ResponseEntity<List<MealLogResponse>> getLogs(
            @PathVariable Integer id,
            // Đón param ?date=YYYY-MM-DD. Nếu Frontend không gửi, mặc định là ngày hôm nay.
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        // Xử lý giá trị mặc định
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        System.out.println(targetDate);

        List<MealLogResponse> logs = nutriServices.getLogsByDate(id, targetDate);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("nutri/log")
    public String createLog(@RequestBody FoodLogRequest meal) {

        return nutriServices.createLog(meal);
    }

    @PutMapping("nutri/log/{mealId}")
    public String updateLog(@PathVariable Integer mealId, @RequestBody MealUpdateRequest meal) {
        return nutriServices.updateLog(mealId, meal);
    }

    @DeleteMapping("nutri/log/{mealId}")
    public String deleteLog(@PathVariable Integer mealId) {
        return nutriServices.deleteLog(mealId);
    }

    @GetMapping("nutri/weekly/{userId}")
    public ResponseEntity<List<WeeklyMacroResponse>> getWeeklyChartData(
            @PathVariable Integer userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // Nếu Frontend không truyền endDate, mặc định lấy ngày hôm nay làm mốc
        LocalDate targetEndDate = (endDate != null) ? endDate : LocalDate.now();

        List<WeeklyMacroResponse> response = dailyMacroServices.getWeeklyMacroFlow(userId, targetEndDate);

        return ResponseEntity.ok(response);
    }
}
