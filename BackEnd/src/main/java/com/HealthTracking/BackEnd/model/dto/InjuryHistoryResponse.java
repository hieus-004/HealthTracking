package com.HealthTracking.BackEnd.model.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InjuryHistoryResponse {
    private String date;
    private Map<String, Integer> joints; // "Vai": 7, "Cổ": 5
}
