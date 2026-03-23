package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.Body;

@Repository
public interface BodyRepo extends JpaRepository<Body, Integer> {

}
