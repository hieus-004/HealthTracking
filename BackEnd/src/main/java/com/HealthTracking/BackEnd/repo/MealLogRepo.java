package com.HealthTracking.BackEnd.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HealthTracking.BackEnd.model.MealLog;

public interface MealLogRepo extends JpaRepository<MealLog, Integer>{

    List<MealLog> findAllByUser_UserIdAndDate(Integer id, LocalDate date);

}
