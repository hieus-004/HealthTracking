package com.HealthTracking.BackEnd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.Body;
import com.HealthTracking.BackEnd.services.BodyServices;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class BodyController {

    @Autowired
    private BodyServices bodyServices;

    @GetMapping("body")
    public List<Body> getAllBody() {
        return bodyServices.getAllBody();
    }

    @GetMapping("body/{id}")
    public Body getBodyById(@PathVariable Integer id){
        return bodyServices.getBodyById(id);
    }

    @PostMapping("body")
    public String saveBody(@RequestBody Body body){
        return bodyServices.save(body);
    }

    @DeleteMapping("body/{id}")
    public String deleteBodyById(@PathVariable Integer id){
        return bodyServices.deleteBodyById(id);
    }
    
}
