package com.HealthTracking.BackEnd.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Body;
import com.HealthTracking.BackEnd.model.dto.BodyResponse;
import com.HealthTracking.BackEnd.repo.BodyRepo;

@Service
public class BodyServices {

    @Autowired
    private BodyRepo bodyRepo;

    public List<Body> getAllBody() {
        return bodyRepo.findAll();
    }

    public Body getBodyById(Integer id) {
        return bodyRepo.findById(id).orElse(null);
    }

    public String save(Body body) {
        bodyRepo.save(body);
        return("Post body is called");
    }

    public String deleteBodyById(Integer id) {
        bodyRepo.deleteById(id);
        return("Delete body is called");
    }

    public String updateBody(Integer id, Body body) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateBody'");
    }

    public List<BodyResponse> getBodyEvolutionHistory(Integer id) {
        // 1. Lấy toàn bộ bản ghi Body của User, sắp xếp từ CŨ đến MỚI
        List<Body> bodies = bodyRepo.findAllByUser_UserIdOrderByTimestampAsc(id);

        // 2. Map từ Entity sang DTO (Chỉ lấy các trường cần thiết cho biểu đồ)
        return bodies.stream().map(body -> {
            BodyResponse dto = new BodyResponse();
            dto.setId(body.getBodyId());
            dto.setWeight(body.getWeight());
            dto.setBodyfatPerc(body.getBodyfatPerc());
            dto.setSmm(body.getSmm());
            dto.setTimestamp(body.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
    }


}
