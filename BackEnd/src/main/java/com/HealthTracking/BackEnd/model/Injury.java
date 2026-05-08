package com.HealthTracking.BackEnd.model;

import java.time.LocalDate;

import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
public class Injury {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer injuryId;
    
    @Nationalized
    private String injuryName;
    private Integer injuryScale; //from 1-10
    private LocalDate timestamp;

    @Nationalized
    private String injuryDesc;

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(name =  "userId")
    private User user;
    
    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "jointId")
    private Joints joint;

}
