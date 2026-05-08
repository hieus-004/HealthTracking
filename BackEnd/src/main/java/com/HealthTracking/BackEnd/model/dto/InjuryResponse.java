package com.HealthTracking.BackEnd.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InjuryResponse {
    private Integer jointId;
    private Integer injuryScale;
}