package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Body;
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


}
