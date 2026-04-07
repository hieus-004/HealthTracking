package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
// DTO này dùng cho trang Nutrient Tracker (Lúc tìm kiếm và hiển thị bảng)
public class FoodSimpleDto {
    private Integer id; 
    private String name;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double calories;
    private String category;
    private Double servingWeight; // Nên thêm để phục vụ logic tính "Phần ăn"
}
