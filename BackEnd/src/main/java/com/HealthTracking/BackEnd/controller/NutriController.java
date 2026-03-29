package com.HealthTracking.BackEnd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.dto.DailyMacroResponse;
import com.HealthTracking.BackEnd.model.dto.WeightRangeResponse;
import com.HealthTracking.BackEnd.services.NutriServices;

@RestController
@RequestMapping("/api")
public class NutriController {
    
    @Autowired
    private NutriServices nutriServices;
    
    @GetMapping("nutri/{id}/recommendCalories")
    public DailyMacroResponse getRcmdCalories(@PathVariable Integer id) {
        return nutriServices.getRecommendedCalories(id);
    }

    @GetMapping("nutri/{id}/weightRange")
    public WeightRangeResponse getWeightRange(@PathVariable Integer id) {
        return nutriServices.getWeightRange(id);
    }
}
