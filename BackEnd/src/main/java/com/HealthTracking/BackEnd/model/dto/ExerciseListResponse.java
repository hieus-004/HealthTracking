package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ExerciseListResponse {
    private Integer exerciseId;
    private String exerciseName;
    private String videoUrl;

    
}
