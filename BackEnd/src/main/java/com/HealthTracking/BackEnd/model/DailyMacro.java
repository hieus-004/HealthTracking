package com.HealthTracking.BackEnd.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class DailyMacro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer macroId;

    private Integer userId;
    
    private Integer tKcal;
    private Integer remKcal;
    private Integer tProtein;
    private Integer tCarb;
    private Integer tFat;
    private Integer remProtein;
    private Integer remCarb;
    private Integer remFat;
    private OffsetDateTime date;
}
