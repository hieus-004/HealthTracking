package com.HealthTracking.BackEnd.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class ExerciseDTO {
    private Integer exId;
    private String exName;
    private String exNameVN;
    private String partName;
    private Integer difficulty;
    private String equipment;
    private String ytUrl;
    private Double pr;
    private List<String> instruction; // Thường dùng List thay vì String[] cho linh hoạt
    private Double suitPerc;
    
    private List<String> injuryTags; // Tách chuỗi 'caution' thành List
    // private List<String> secondaryMuscles; // Nếu Database ông chưa có trường này, tạm thời bỏ qua hoặc mock
    // private List<String> safetyTips; // Nếu chưa có, có thể mock tạm ở Frontend
}