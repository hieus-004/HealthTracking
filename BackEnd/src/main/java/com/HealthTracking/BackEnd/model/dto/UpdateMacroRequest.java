package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateMacroRequest {
    private Integer macroId;
    private Double cKcal;
    private Double cProtein;
    private Double cCarb;
    private Double cFat;
}
