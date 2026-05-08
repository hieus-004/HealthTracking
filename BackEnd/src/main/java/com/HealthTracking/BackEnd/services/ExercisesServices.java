package com.HealthTracking.BackEnd.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Exercises;
import com.HealthTracking.BackEnd.model.dto.ExerciseDTO;
import com.HealthTracking.BackEnd.model.dto.ExerciseListResponse;
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

    public List<Exercises> saveAll(List<Exercises> exercises) {
        return exercisesRepo.saveAll(exercises);
    }

    public String deleteAll() {
        exercisesRepo.deleteAll();
        return "Delete method called";
    }

    // Đổi kiểu trả về ở đây
    public List<ExerciseListResponse> getExBrowser() {
        // 💡 Lời khuyên: Nhớ dùng Query JOIN FETCH thay vì findAll() để tránh lỗi N+1 như mình nói ở trên nhé!
        List<Exercises> exercises = exercisesRepo.findAll();

        // Map từ Entity sang DTO
        return exercises.stream().map(exercise -> {
            ExerciseListResponse dto = new ExerciseListResponse();
            dto.setExerciseId(exercise.getExId());
            dto.setExerciseName(exercise.getExName());
            dto.setExerciseNameVN(exercise.getExNameVN());
            
            // Cẩn thận lỗi LazyInitialization ở dòng này nếu chưa dùng JOIN FETCH
            if (exercise.getBodyPart() != null) {
                dto.setPartName(exercise.getBodyPart().getPartName());
            }
            
            dto.setEquipment(exercise.getEquipment());
            dto.setDifficulty(exercise.getDifficulty());
            dto.setSuitPerc(exercise.getSuitPerc());
            dto.setPr(exercise.getPr());

            return dto;
        }).collect(Collectors.toList()); 
        // Trả về đúng List hợp lệ
    }

    public ExerciseDTO getExDetails(Integer id) {
        // 1. Tìm trong DB. Nếu không thấy thì ném lỗi (Frontend sẽ nhận được 404 hoặc 500 tùy ông config)
        Exercises exercise = exercisesRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + id));

        // 2. Map từ Entity sang DTO
        ExerciseDTO dto = new ExerciseDTO();
        dto.setExId(exercise.getExId());
        dto.setExName(exercise.getExName());
        dto.setExNameVN(exercise.getExNameVN());
        
        if (exercise.getBodyPart() != null) {
            dto.setPartName(exercise.getBodyPart().getPartName());
        }
        
        dto.setDifficulty(exercise.getDifficulty());
        dto.setEquipment(exercise.getEquipment());
        dto.setYtUrl(exercise.getYtUrl());
        dto.setPr(exercise.getPr());
        dto.setInstruction(exercise.getInstruction());
        dto.setSuitPerc(exercise.getSuitPerc());

        // Xử lý chuỗi caution thành List<String> cho mảng injuryTags
        if (exercise.getCaution() != null && !exercise.getCaution().isEmpty()) {
            dto.setInjuryTags(Arrays.asList(exercise.getCaution().split(",")));
        } else {
            dto.setInjuryTags(new ArrayList<>());
        }

        return dto;
    }
}
