package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserBodyResponse {
    private String userName;
    private Integer age;
    private String gender;
    private Double weight;
    private Double height;
    private Double bodyfatPerc;
    private Double smm;
    private String target;
    private String activityLevel;

}
