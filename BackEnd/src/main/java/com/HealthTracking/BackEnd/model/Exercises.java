package com.HealthTracking.BackEnd.model;

import java.util.List;

import org.hibernate.annotations.Nationalized;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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

    private String ytUrl;

    @Nationalized
    private String exDesc;

    @Nationalized
    @ElementCollection
    @CollectionTable(name = "exercise_instructions", joinColumns = @JoinColumn(name = "exId"))
    @Column(name = "step")
    private List<String> instruction;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partId")
    private BodyPart bodyPart;
    
    private Integer pr;
    private String caution;
    private Double suitPerc;

}
