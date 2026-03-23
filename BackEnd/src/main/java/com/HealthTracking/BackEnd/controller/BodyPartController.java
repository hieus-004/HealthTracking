package com.HealthTracking.BackEnd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.BodyPart;
import com.HealthTracking.BackEnd.services.BodyPartServices;

@RestController
public class BodyPartController {

    @Autowired
    private BodyPartServices bodyPartServices;

    @GetMapping("bodyPart")
    public List<BodyPart> getAllBodyPart(){
        return bodyPartServices.getAllBodyPart();
    }

    @GetMapping("bodyPart/{id}")
    public BodyPart getBodyPartById(@PathVariable Integer id){
        return bodyPartServices.getBodyPartById(id);
    }

    @PostMapping("bodyPart")
    public String saveBodyPart(@RequestBody BodyPart bodyPart){
        return bodyPartServices.save(bodyPart);
    }

    @DeleteMapping("bodyPart/{id}")
    public String deleteBodyPartById(@PathVariable Integer id){
        return bodyPartServices.deleteById(id);
    }
}
