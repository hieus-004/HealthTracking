package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Food;
import com.HealthTracking.BackEnd.repo.FoodRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodServices {

    private final FoodRepo foodRepo;

    public List<Food> getAllFood() {
        return foodRepo.findAll();
    }

    public String createFood(Food food) {
        Food exist = foodRepo.findByFoodName(food.getFoodName());
        if(exist == null){
            foodRepo.save(food);
            return ("Food created");
        }
        return ("This food is already existed");
    }



}
