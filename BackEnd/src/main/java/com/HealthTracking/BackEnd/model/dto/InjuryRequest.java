package com.HealthTracking.BackEnd.model.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InjuryRequest {
    private Integer userId;
    private LocalDate timestamp;
    private Integer jointId;
    private Integer injuryScale;    
}
