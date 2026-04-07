package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.Food;

@Repository
public interface FoodRepo extends JpaRepository<Food, Integer> {

    Food findByFoodName(String foodName);

    

}
