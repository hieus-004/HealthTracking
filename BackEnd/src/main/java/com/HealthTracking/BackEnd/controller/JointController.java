package com.HealthTracking.BackEnd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.Joints;
import com.HealthTracking.BackEnd.services.JointServices;

@RequestMapping("/api")
@RestController
public class JointController {

    @Autowired
    private JointServices jointServices;

    @GetMapping("joints")
    public List<Joints> getAllJoints() {
        return jointServices.getAllJoints();
    }

    @DeleteMapping("joints")
    public String deleteAllJoints() {
        return jointServices.deleteAllJoints();
    }

    @PostMapping("joints/batch")
    public ResponseEntity<?> createMultipleJoints(@RequestBody List<Joints> joints) {
        List<Joints> savedJoints = jointServices.saveAll(joints);
        return ResponseEntity.ok(savedJoints);

    }
}
