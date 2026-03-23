package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HealthTracking.BackEnd.model.BodyPart;

public interface BodyPartRepo extends JpaRepository<BodyPart, Integer>{

}
