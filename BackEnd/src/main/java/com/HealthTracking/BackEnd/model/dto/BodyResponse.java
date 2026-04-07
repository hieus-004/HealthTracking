package com.HealthTracking.BackEnd.model.dto;

import java.time.OffsetDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BodyResponse {
    private Integer id;              // ID của bản ghi Body để quản lý
    private Double weight;        // Trục Y1
    private Double bodyfatPerc;   // Trục Y2
    private Double smm;           // Trục Y3
    private OffsetDateTime timestamp; // Trục X (Thời gian)
}
