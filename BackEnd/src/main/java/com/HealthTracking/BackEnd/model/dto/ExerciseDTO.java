package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ExerciseDTO {
    private Integer exId;
    private String exName;
    private Double suitPerc;
}
