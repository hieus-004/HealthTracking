package com.HealthTracking.BackEnd.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PlanDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detailId;

    // 1-7 tương ứng với Thứ 2 - Chủ nhật
    private Integer dayOfWeek; 

    // Thứ tự tập luyện trong ngày (Bài 1, Bài 2, Bài 3...)
    private Integer exerciseOrder; 

    // Số hiệp (Sets) do AI/User thiết lập
    private Integer assignedSets; 

    // Số lần lặp lại (Reps). Để String vì có thể nhập "8-12" hoặc "Đến thất bại (Failure)"
    private String assignedReps; 

    // --- CÁC MỐI QUAN HỆ (RELATIONSHIPS) ---

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    // 1. Khóa ngoại trỏ về bảng Bìa Lịch Tập (WorkoutPlan)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planId")
    private WorkoutPlan workoutPlan;

    // 2. Khóa ngoại trỏ về Thư viện Bài tập (Exercises) mà ông vừa Post vào DB
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exId")
    private Exercises exercise;
}