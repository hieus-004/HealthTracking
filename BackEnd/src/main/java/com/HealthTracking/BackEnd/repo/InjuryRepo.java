package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.Injury;

@Repository
public interface InjuryRepo extends JpaRepository<Injury, Integer> {
    
}
