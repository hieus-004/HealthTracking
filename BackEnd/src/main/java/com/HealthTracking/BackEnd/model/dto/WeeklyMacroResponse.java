package com.HealthTracking.BackEnd.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyMacroResponse {
    private String date;   // Sẽ trả về chuỗi "2026-04-15"
    private Double cKcal;  // Calo đã nạp (In)
    private Double tKcal;  // Calo mục tiêu (Target/Out)
}