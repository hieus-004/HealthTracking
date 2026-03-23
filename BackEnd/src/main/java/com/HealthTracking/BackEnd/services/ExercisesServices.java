package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Exercises;
import com.HealthTracking.BackEnd.repo.ExercisesRepo;

@Service
public class ExercisesServices {

    @Autowired
    private ExercisesRepo exercisesRepo;

    public List<Exercises> getAll() {
        return exercisesRepo.findAll();
    }

    public Exercises getById(Integer id) {
        return exercisesRepo.findById(id).orElse(null);
    }

    public Exercises save(Exercises exercises) {
        if(exercises.getExName() == null || exercises.getExName().isEmpty()){
            throw new IllegalArgumentException("Exercise name cannot be empty");
        }
        return exercisesRepo.save(exercises);
    }
}
