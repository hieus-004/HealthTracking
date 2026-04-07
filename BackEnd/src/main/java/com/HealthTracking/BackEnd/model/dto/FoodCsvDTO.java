package com.HealthTracking.BackEnd.model.dto;

import com.opencsv.bean.CsvBindByPosition;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FoodCsvDTO {

    @CsvBindByPosition(position = 0)
    private String name;

    @CsvBindByPosition(position = 1)
    private Double protein;

    @CsvBindByPosition(position = 2)
    private Double carbs;

    @CsvBindByPosition(position = 3)
    private Double fat;

    @CsvBindByPosition(position = 4)
    private Double calories;

    @CsvBindByPosition(position = 5)
    private String category;

    @CsvBindByPosition(position = 6)
    private String origin;

    @CsvBindByPosition(position = 7)
    private String dietType;

    @CsvBindByPosition(position = 8)
    private String foodDesc;
}
