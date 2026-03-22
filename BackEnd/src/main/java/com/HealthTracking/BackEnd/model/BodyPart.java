package com.HealthTracking.BackEnd.model;

import java.util.ArrayList;
import java.util.List;

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

    private String partName; 

    @OneToMany(mappedBy = "bodyPart", fetch = FetchType.LAZY)
    private List<Exercises> exercisesList= new ArrayList<>();

    @OneToMany(mappedBy = "bodyPart", fetch = FetchType.LAZY)
    private List<Injury> injuries = new ArrayList<>();

}
