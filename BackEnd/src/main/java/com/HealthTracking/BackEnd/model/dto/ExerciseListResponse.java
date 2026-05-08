package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ExerciseListResponse {
    private Integer exerciseId;
    private String exerciseName;
    private String exerciseNameVN;

    private String partName;
    private Integer difficulty;
    private String equipment;
    private Double suitPerc;
    private Double pr;
    
}
