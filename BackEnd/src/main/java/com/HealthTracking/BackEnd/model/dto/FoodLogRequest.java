package com.HealthTracking.BackEnd.model.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FoodLogRequest {
    private Integer userId;
    private Integer foodId;
    private Integer amount;
    private String mealTime;
    private LocalDate date;
}
