package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DailyMacroRequest {
    private Integer userId;
    private Integer height;
    private Integer weight;
    private Double bodyfatPerc;
    private Integer smm;
    private String target;
    private String gender;
    private Integer age;
    private String activityLevel;
}
