package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.BodyPart;
import com.HealthTracking.BackEnd.repo.BodyPartRepo;

@Service
public class BodyPartServices {

    @Autowired
    private BodyPartRepo bodyPartRepo;

    public List<BodyPart> getAllBodyPart() {
        return bodyPartRepo.findAll();
    }

    public BodyPart getBodyPartById(Integer id) {
        return bodyPartRepo.findById(id).orElse(null);
    }

    public String save(BodyPart bodyPart) {
        bodyPartRepo.save(bodyPart);
        return("Post bodyPart is called");
    }

    public String deleteById(Integer id) {
        bodyPartRepo.deleteById(id);
        return("Delete bodyPart is called");
    }

}
