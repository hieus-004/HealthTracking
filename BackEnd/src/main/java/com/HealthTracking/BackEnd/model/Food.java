package com.HealthTracking.BackEnd.model;

import org.hibernate.annotations.Nationalized;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer foodId;

    @Nationalized
    private String foodName;

    @Nationalized
    private String foodDesc;
    private Double carb;
    private Double protein;
    private Double fat;
    private Double calories;

    @Nationalized
    private String category;

    @Nationalized
    private String origin;

    @Nationalized
    private String dietType;

    
}
