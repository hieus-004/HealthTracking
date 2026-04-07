package com.HealthTracking.BackEnd.model;

import org.hibernate.annotations.Nationalized;

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
public class Joints {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jointId;

    @Nationalized
    private String jointName;

    @Nationalized
    private String jointDesc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partId")
    private BodyPart bodyPart;
}
