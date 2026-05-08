package com.HealthTracking.BackEnd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.Exercises;
import com.HealthTracking.BackEnd.model.dto.ExerciseDTO;
import com.HealthTracking.BackEnd.model.dto.ExerciseListResponse;
import com.HealthTracking.BackEnd.services.ExercisesServices;

@RestController
@RequestMapping("/api")
public class ExercisesController {

    @Autowired
    private ExercisesServices exercisesServices;

    @GetMapping("exercises")
    public List<Exercises> getAllExercises(){
        return exercisesServices.getAll();
    }

    @GetMapping("exercises/{id}")
    public Exercises getExercisesById(@PathVariable Integer id){
        return exercisesServices.getById(id);
    }

    @PostMapping("exercises")
    public ResponseEntity<String> saveExercises(@RequestBody Exercises exercises){
        return new ResponseEntity<>(exercisesServices.save(exercises).toString(), HttpStatus.CREATED);
    }

    @PostMapping("exercises/batch")
    public ResponseEntity<?> createMultipleBodyParts(@RequestBody List<Exercises> exercises) {
        List<Exercises> savedEx = exercisesServices.saveAll(exercises);
        return ResponseEntity.ok(savedEx);
         
    }

    @DeleteMapping("exercises/deleteAll")
    public String deleteAllEx(){
        return exercisesServices.deleteAll();
    }

    @GetMapping("exercisesBrowser")
    public ResponseEntity<List<ExerciseListResponse>> getExBrowser(){
        // Lấy dữ liệu thô từ Service
        List<ExerciseListResponse> data = exercisesServices.getExBrowser();
        
        // Đóng gói vào hộp ResponseEntity.ok() (tương đương HTTP Status 200)
        return ResponseEntity.ok(data);
    }

    @GetMapping("exercisesDetails/{id}")
    public ResponseEntity<ExerciseDTO> getExDetails(@PathVariable Integer id){
        // Lấy dữ liệu thô từ Service
        ExerciseDTO data = exercisesServices.getExDetails(id);
        // Đóng gói vào hộp ResponseEntity.ok() (tương đương HTTP Status 200)
        return ResponseEntity.ok(data);
    }

}
