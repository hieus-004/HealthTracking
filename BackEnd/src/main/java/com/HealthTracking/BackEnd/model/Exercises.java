package com.HealthTracking.BackEnd.model;

import java.util.List;

import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Exercises {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer exId;

    private String exImgUrl;

    private String exName;

    @Nationalized
    private String exNameVN;

    private String ytUrl;

    @Nationalized
    private String exDesc;

    private String exerciseType;

    @Nationalized
    @ElementCollection
    @CollectionTable(name = "exercise_instructions", joinColumns = @JoinColumn(name = "exId"))
    @Column(name = "step")
    private List<String> instruction;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partId")
    private BodyPart bodyPart;

    private String equipment;
    
    private Integer difficulty; //from 1-3 (easy - intermediate - advanced)
    private Double pr;
    private String caution;
    private Double suitPerc;

}
