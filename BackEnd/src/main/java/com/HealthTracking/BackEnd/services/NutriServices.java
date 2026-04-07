package com.HealthTracking.BackEnd.services;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Body;
import com.HealthTracking.BackEnd.model.DailyMacro;
import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.dto.DailyMacroResponse;
import com.HealthTracking.BackEnd.model.dto.WeightRangeResponse;
import com.HealthTracking.BackEnd.repo.BodyRepo;
import com.HealthTracking.BackEnd.repo.DailyMacroRepo;
import com.HealthTracking.BackEnd.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NutriServices {
    private final UserRepo userRepo;
    private final BodyRepo bodyRepo;
    private final DailyMacroRepo dailyMacroRepo;

    private Integer cunningham(Double weight, Double smm, Double bodyfatPerc) {
        return (int) Math.round(500 + 22 * smm);
    }

    private Integer mifflinStJeor(Double weight, Double height, Integer age, String gender) {
        Integer s = 0;
        if(gender.equalsIgnoreCase("male")) s = 5;
        else if (gender.equalsIgnoreCase("female")) s = -161;
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
        if(user != null && user.getActivityLevel() != null) {
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
        if(body.getBodyfatPerc() != null && body.getSmm() != null) {
            Integer calories = cunningham(body.getWeight().doubleValue(), body.getSmm(), body.getBodyfatPerc());
            calories = (int) Math.round(calories * PAL);
            DailyMacroResponse response = new DailyMacroResponse();
            if(body.getTarget().equalsIgnoreCase("lose weight")) {
                calories = (int) Math.round(calories * (1 - caloriesSpeed));
                response.setProtein((int) Math.round(2.3 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.2 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
                System.out.println(response.getProtein() + " " + response.getFat() + " " + response.getCarbs());
            }
            else if(body.getTarget().equalsIgnoreCase("gain muscle")) {
                System.out.println(body.getTarget());
                calories = (int) Math.round(calories * (1 + caloriesSpeed));
                response.setProtein((int) Math.round(2 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.25 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
                System.out.println(response.getProtein() + " " + response.getFat() + " " + response.getCarbs());
            }
            else if(body.getTarget().equalsIgnoreCase("maintain weight")) {
                calories = (int) Math.round(calories);
                response.setProtein((int) Math.round(2 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.25 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
                System.out.println(response.getProtein() + " " + response.getFat() + " " + response.getCarbs());
            }
            response.setCalories(calories);
            return response;
        }

        if(user != null && body != null) {
            Integer calories = mifflinStJeor(body.getWeight().doubleValue(), body.getHeight().doubleValue(), user.getAge(), user.getGender());
            calories = (int) Math.round(calories * PAL);
            DailyMacroResponse response = new DailyMacroResponse();
            if(body.getTarget().equalsIgnoreCase("lose weight")) {
                calories = (int) Math.round(calories * (1 - caloriesSpeed));
                response.setProtein((int) Math.round(2.3 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.2 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
            }
            else if(body.getTarget().equalsIgnoreCase("gain muscle")) {
                System.out.println(body.getTarget());
                calories = (int) Math.round(calories * (1 + caloriesSpeed));
                response.setProtein((int) Math.round(2 * body.getWeight()));
                response.setFat((int) Math.round(calories * 0.25 / 9));
                response.setCarbs((int) Math.round((calories - response.getProtein() * 4 - response.getFat() * 9) / 4));
                System.out.println(response.getProtein() + " " + response.getFat() + " " + response.getCarbs());
            }
            else if(body.getTarget().equalsIgnoreCase("maintain weight")) {
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
        if(body == null) return null;
        WeightRangeResponse response = new WeightRangeResponse();
        if (body.getBodyfatPerc() == null) { // Chỉ cần check BodyFat là đủ để switch sang BMI
            double heightM = body.getHeight().doubleValue() / 100.0;
            response.setMinWeight(Math.round(18.5 * Math.pow(heightM, 2) * 10.0) / 10.0);
            response.setMaxWeight(Math.round(22.9 * Math.pow(heightM, 2) * 10.0) / 10.0);
        } 
        else {
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

    public DailyMacroResponse getTodayMacro(Integer id) {
        DailyMacroResponse response = getRecommendedCalories(id);
        LocalDate today = LocalDate.now();
        DailyMacro todayMacro = dailyMacroRepo.findFirstByUser_UserIdAndDate(id, today).orElse(null);
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
}
