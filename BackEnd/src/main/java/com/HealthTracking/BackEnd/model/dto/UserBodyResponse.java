package com.HealthTracking.BackEnd.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserBodyResponse {
    @NotBlank(message = "Tên không được để trống")
    private String userName;

    @Min(value = 0, message = "Tuổi không hợp lệ")
    private Integer age;

    private String gender;
    @Positive(message = "Cân nặng phải lớn hơn 0")
    private Double weight;

    @Positive(message = "Chiều cao phải lớn hơn 0")
    private Double height;
    
    private Double bodyfatPerc;
    private Double smm;
    private String target;
    private String activityLevel;
    private Double bmi;
    private String targetIntensity;
}
