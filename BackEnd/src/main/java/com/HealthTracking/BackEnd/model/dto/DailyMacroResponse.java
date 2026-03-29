package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DailyMacroResponse {
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fat;
}
