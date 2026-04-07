package com.HealthTracking.BackEnd.services;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.HealthTracking.BackEnd.model.Food;
import com.HealthTracking.BackEnd.model.dto.FoodCsvDTO;
import com.HealthTracking.BackEnd.repo.FoodRepo;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodImportServices {

    private final FoodRepo foodRepo;

    public void importFoodsFromCsv(MultipartFile file) {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            // 1. Khởi tạo CsvToBean để parse file
            CsvToBean<FoodCsvDTO> csvToBean = new CsvToBeanBuilder<FoodCsvDTO>(reader)
                    .withType(FoodCsvDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();

            // 2. Chuyển nội dung CSV thành List DTO
            List<FoodCsvDTO> foodDtos = csvToBean.parse();

            // 3. Map từ DTO sang Entity và lưu vào DB
            List<Food> foods = foodDtos.stream().map(dto -> {
                Food food = new Food();
                food.setFoodName(dto.getName());
                food.setProtein(dto.getProtein());
                food.setCarb(dto.getCarbs());
                food.setFat(dto.getFat());
                food.setCalories(dto.getCalories());
                food.setCategory(dto.getCategory());
                food.setOrigin(dto.getOrigin());
                food.setDietType(dto.getDietType());
                food.setFoodDesc(dto.getFoodDesc());
                return food;
            }).collect(Collectors.toList());

            foodRepo.saveAll(foods);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi import file CSV: " + e.getMessage());
        }
    }
}
