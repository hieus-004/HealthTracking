package com.HealthTracking.BackEnd.model;

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
public class Exercises {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer exId;
    private String exName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partId")
    private BodyPart bodyPart;
    
    private Integer pr;
    private String caution;
    private Double suitPerc;

}
