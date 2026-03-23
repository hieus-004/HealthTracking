package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.DailyMacro;

@Repository
public interface DailyMacroRepo extends JpaRepository<DailyMacro, Integer> {

}
