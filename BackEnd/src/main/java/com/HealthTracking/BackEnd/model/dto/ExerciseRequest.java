package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ExerciseRequest {
    private Integer userId;
    private Integer injuryScale;
    private String injuryName;
    private Integer partId;
}
