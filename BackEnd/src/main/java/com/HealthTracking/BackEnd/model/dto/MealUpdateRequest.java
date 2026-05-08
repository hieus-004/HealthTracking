package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MealUpdateRequest {
    private Integer amount;
    private String mealTime;
}
