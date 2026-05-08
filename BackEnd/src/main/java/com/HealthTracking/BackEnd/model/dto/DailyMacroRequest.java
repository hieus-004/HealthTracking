package com.HealthTracking.BackEnd.model.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DailyMacroRequest {
    private Integer macroId;
    private Double tKcal;
    private Double tProtein;
    private Double tCarb;
    private Double tFat;
    private Double cKcal;
    private Double cProtein;
    private Double cCarb;
    private Double cFat;
    private LocalDate date;
    private Integer userId;
}
