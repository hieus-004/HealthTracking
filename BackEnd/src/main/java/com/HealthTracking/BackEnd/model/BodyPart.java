package com.HealthTracking.BackEnd.model;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter 
@Setter
public class BodyPart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer partId;

    @Nationalized
    private String partName; 

    @JsonIgnore
    @OneToMany(mappedBy = "bodyPart", fetch = FetchType.LAZY)
    private List<Exercises> exercisesList= new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "bodyPart", fetch = FetchType.LAZY)
    private List<Joints> joints = new ArrayList<>();

}
