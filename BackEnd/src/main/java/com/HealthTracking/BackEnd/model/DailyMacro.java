package com.HealthTracking.BackEnd.model;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class DailyMacro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer macroId;
    
    private Double tKcal;
    private Double cKcal;
    private Double tProtein;
    private Double tCarb;
    private Double tFat;
    private Double cProtein;
    private Double cCarb;
    private Double cFat;
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "userId")
    private User user;
}

// @ToString.Exclude
//     @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
//     @JoinColumn(name =  "userId")
//     private User user;