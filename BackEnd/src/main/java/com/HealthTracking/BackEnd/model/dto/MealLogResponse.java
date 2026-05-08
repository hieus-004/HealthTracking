package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MealLogResponse {
    private Integer mealId;
    private Integer foodId;
    private Integer amount;
    private String mealTime;
}
