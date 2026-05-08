package com.HealthTracking.BackEnd.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Body;
import com.HealthTracking.BackEnd.model.DailyMacro;
import com.HealthTracking.BackEnd.model.Food;
import com.HealthTracking.BackEnd.model.MealLog;
import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.dto.DailyMacroResponse;
import com.HealthTracking.BackEnd.model.dto.FoodLogRequest;
import com.HealthTracking.BackEnd.model.dto.MealLogResponse;
import com.HealthTracking.BackEnd.model.dto.MealUpdateRequest;
import com.HealthTracking.BackEnd.model.dto.WeightRangeResponse;
import com.HealthTracking.BackEnd.repo.BodyRepo;
import com.HealthTracking.BackEnd.repo.DailyMacroRepo;
import com.HealthTracking.BackEnd.repo.FoodRepo;
import com.HealthTracking.BackEnd.repo.MealLogRepo;
import com.HealthTracking.BackEnd.repo.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NutriServices {
    private final UserRepo userRepo;
    private final BodyRepo bodyRepo;
    private final DailyMacroRepo dailyMacroRepo;
    private final MealLogRepo mealLogRepo;
    private final FoodRepo foodRepo;

    private Integer cunningham(Double weight, Double smm, Double bodyfatPerc) {
        return (int) Math.round(500 + 22 * smm);
    }

    private Integer mifflinStJeor(Double weight, Double height, Integer age, String gender) {
        Integer s = 0;
        if (gender.equalsIgnoreCase("male"))
            s = 5;
        else if (gender.equalsIgnoreCase("female"))
            s = -161;
        return (int) Math.round(10 * weight + 6.25 * height - 5 * age + s);
    }

    public DailyMacroResponse getRecommendedCalories(Integer id) {

        User user = userRepo.findById(id).orElse(null);
        Body body = bodyRepo.findFirstByUser_UserIdOrderByTimestampDesc(id).orElse(null);
        Double caloriesSpeed;
        switch (body.getTargetIntensity().toLowerCase()) {
            case "fast":
                caloriesSpeed = 0.2;
                break;

            case "aggressive":
                caloriesSpeed = 0.25;
                break;

            case "balanced":
                caloriesSpeed = 0.1;
                break;
            default:
                caloriesSpeed = 0.0;
        }

        Double PAL = 1.2;
        if (user != null && user.getActivityLevel() != null) {
            switch (user.getActivityLevel().toLowerCase()) {
                case "sedentary":
                    PAL = 1.2;
                    break;
                case "lightly active":
                    PAL = 1.375;
                    break;
                case "moderately active":
                    PAL = 1.55;
                    break;
                case "very active":
                    PAL = 1.725;
                    break;
                case "extra active":
                    PAL = 1.9;
                    break;
                default:
                    PAL = 1.2;
            }
        }
        if (body.getBodyfatPerc() != 0 && body.getSmm() != 0) {
            Integer calories = cunningham(body.getWeight().doubleValue(), body.getSmm(), body.getBodyfatPerc());
            calories = (int) Math.round(calories * PAL);
            DailyMacroResponse response = new DailyMacroResponse();
            if (body.getTarget().equalsIgnoreCase("lose weight")) {
                calories = (int) Math.round(calories * (1 - caloriesSpeed));
                response.setProtein((int) Math.round(2.3 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.2 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
            } else if (body.getTarget().equalsIgnoreCase("gain muscle")) {

                calories = (int) Math.round(calories * (1 + caloriesSpeed));
                response.setProtein((int) Math.round(2 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.25 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
            } else if (body.getTarget().equalsIgnoreCase("maintain weight")) {
                calories = (int) Math.round(calories);
                response.setProtein((int) Math.round(2 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.25 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
            }
            response.setCalories(calories);
            return response;
        }

        if (user != null && body != null) {
            Integer calories = mifflinStJeor(body.getWeight().doubleValue(), body.getHeight().doubleValue(),
                    user.getAge(), user.getGender());
            calories = (int) Math.round(calories * PAL);
            DailyMacroResponse response = new DailyMacroResponse();
            if (body.getTarget().equalsIgnoreCase("lose weight")) {
                calories = (int) Math.round(calories * (1 - caloriesSpeed));
                response.setProtein((int) Math.round(2.3 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.2 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
            } else if (body.getTarget().equalsIgnoreCase("gain muscle")) {
                calories = (int) Math.round(calories * (1 + caloriesSpeed));
                response.setProtein((int) Math.round(2 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.25 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
            } else if (body.getTarget().equalsIgnoreCase("maintain weight")) {
                calories = (int) Math.round(calories);
                response.setProtein((int) Math.round(2 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.25 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
            }
            response.setCalories(calories);
            return response;
        }

        return null;
    }

    public WeightRangeResponse getWeightRange(Integer id) {
        Body body = bodyRepo.findFirstByUser_UserIdOrderByTimestampDesc(id).orElse(null);
        User user = userRepo.findById(id).orElse(null);
        if (body == null)
            return null;
        WeightRangeResponse response = new WeightRangeResponse();
        if (body.getBodyfatPerc() == 0) { // Chỉ cần check BodyFat là đủ để switch sang BMI
            double heightM = body.getHeight().doubleValue() / 100.0;
            response.setMinWeight(Math.round(18.5 * Math.pow(heightM, 2) * 10.0) / 10.0);
            response.setMaxWeight(Math.round(22.9 * Math.pow(heightM, 2) * 10.0) / 10.0);
        } else {
            // Dùng 100.0 để tránh lỗi chia số nguyên
            double lbm = body.getWeight().doubleValue() * (1 - body.getBodyfatPerc() / 100.0);

            double minWeight, maxWeight;
            if (user.getGender().equalsIgnoreCase("male")) {
                maxWeight = lbm / 0.80; // 20% fat
                minWeight = lbm / 0.88; // 12% fat
            } else {
                minWeight = lbm / 0.82; // 18% fat
                maxWeight = lbm / 0.75; // 25% fat
            }

            // Làm tròn 1 chữ số thập phân (ví dụ: 70.5)
            response.setMinWeight(Math.round(minWeight * 10.0) / 10.0);
            response.setMaxWeight(Math.round(maxWeight * 10.0) / 10.0);
        }
        return response;
    }

    public DailyMacroResponse getTodayMacro(Integer id, LocalDate date) {
        DailyMacroResponse response = getRecommendedCalories(id);
        DailyMacro todayMacro = dailyMacroRepo.findFirstByUser_UserIdAndDate(id, date).orElse(null);
        if (todayMacro != null) {
            response.setCCalories(Math.round(todayMacro.getCKcal().floatValue()));
            response.setCProtein(todayMacro.getCProtein().intValue());
            response.setCCarbs(todayMacro.getCCarb().intValue());
            response.setCFat(todayMacro.getCFat().intValue());
            
        } else {
            response.setCCalories(0);
            response.setCProtein(0);
            response.setCCarbs(0);
            response.setCFat(0);
        }
        return response;

    }

    @Transactional
    public String upsertFoodLog(Integer id) {
        return "Log updated";
    }

    public List<MealLogResponse> getLogsByDate(Integer id, LocalDate date) {
        List<MealLog> res = mealLogRepo.findAllByUser_UserIdAndDate(id, date);

        return res.stream().map(log -> {
            MealLogResponse dto = new MealLogResponse();
            dto.setMealId(log.getMealId());
            dto.setAmount(log.getAmount());
            dto.setFoodId(log.getFoods().getFoodId());
            dto.setMealTime(log.getMealTime());
            return dto;
        }).collect(Collectors.toList());
    }

    public String createLog(FoodLogRequest meal) {
        User user = userRepo.findById(meal.getUserId()).orElseThrow(() -> new RuntimeException("Không tìm thấy User"));
        Food food = foodRepo.findById(meal.getFoodId()).orElseThrow(() -> new RuntimeException("Không tìm thấy Food"));

        MealLog mealLog = new MealLog();
        mealLog.setAmount(meal.getAmount());
        mealLog.setDate(meal.getDate());
        mealLog.setFoods(food);
        mealLog.setMealTime(meal.getMealTime());
        mealLog.setUser(user);

        mealLogRepo.save(mealLog);

        return "Thêm mới log thành công";
    }

    public String updateLog(Integer mealId, MealUpdateRequest meal) {
        MealLog log = mealLogRepo.findById(mealId).orElseThrow(() -> new RuntimeException("Không tìm thấy Meal Log"));

        log.setAmount(meal.getAmount());
        log.setMealTime(meal.getMealTime());

        mealLogRepo.save(log);
        return "Cập nhật thông tin bữa ăn thành công";
    }

    public String deleteLog(Integer mealId) {
        mealLogRepo.deleteById(mealId);
        return "Xóa thành công log";
    }
}
