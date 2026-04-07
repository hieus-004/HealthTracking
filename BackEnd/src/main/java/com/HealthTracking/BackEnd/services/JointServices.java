package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.BodyPart;
import com.HealthTracking.BackEnd.model.Joints;
import com.HealthTracking.BackEnd.repo.JointRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JointServices {

    final JointRepo jointRepo;

    public List<Joints> getAllJoints() {
        return jointRepo.findAll();
    }

    public List<Joints> saveAll(List<Joints> joints) {
        return jointRepo.saveAll(joints);
    }
    
}
