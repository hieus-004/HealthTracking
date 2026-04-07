package com.HealthTracking.BackEnd.model;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvolvedJointsId implements Serializable{
    private Integer exercise;
    private Integer joint;
}
