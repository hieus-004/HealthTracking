package com.HealthTracking.BackEnd.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ExerciseResponse {
    List<ExerciseDTO> exerciseRankItems;
    
}