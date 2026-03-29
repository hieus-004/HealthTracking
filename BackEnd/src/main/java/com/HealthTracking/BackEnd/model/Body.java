package com.HealthTracking.BackEnd.model;

import java.time.OffsetDateTime;
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
public class Body {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bodyId;
    
    private Integer height;
    private Double weight;
    private Double bodyfatPerc;
    private Double smm;
    private OffsetDateTime timestamp;
    private String target;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

}
