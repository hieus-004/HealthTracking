package com.HealthTracking.BackEnd.controller;

import com.HealthTracking.BackEnd.model.Food;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.HealthTracking.BackEnd.services.FoodImportServices;
import com.HealthTracking.BackEnd.services.FoodServices;

@RestController
@RequestMapping("/api")
public class FoodController {

    
    @Autowired
    private FoodImportServices foodImportServices;

    @Autowired
    private FoodServices foodServices;

    @GetMapping("/food")
    public List<Food> getAllFood(){
        return foodServices.getAllFood();
    }

    @PostMapping("/food")
    public String createFood(@RequestBody Food food){
        return foodServices.createFood(food);
    }

    @PostMapping("/importFood")
    public ResponseEntity<String> importFoodFromCSV(@RequestParam("file") MultipartFile file) {
        // 1. Kiểm tra file trống
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File không được để trống!");
        }

        // 2. Kiểm tra định dạng file (chỉ chấp nhận .csv)
        if (!file.getOriginalFilename().endsWith(".csv")) {
            return ResponseEntity.badRequest().body("Chỉ chấp nhận định dạng file .csv");
        }

        try {
            foodImportServices.importFoodsFromCsv(file);
            return ResponseEntity.ok("Import dữ liệu thành công!");
        } catch (Exception e) {
            // Trả về lỗi chi tiết để dễ debug khi test Postman
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    
    
}
