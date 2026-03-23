package com.HealthTracking.BackEnd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.Injury;
import com.HealthTracking.BackEnd.services.InjuryServices;

import jakarta.persistence.criteria.CriteriaBuilder.In;

@RestController
public class InjuryController {

    @Autowired
    private InjuryServices injuryServices;

    @GetMapping("injury")
    public List<Injury> getAllInjury(){
        return injuryServices.getAll();
    }

    @GetMapping("injury/{id}")
    public Injury getInjuryById(Integer id){
        return injuryServices.getById(id);
    }

    @PostMapping("injury")
    public String saveInjury(Injury injury){
        return injuryServices.save(injury);
    }

    @PutMapping("injury/{id}")
    public String updateInjuryById(Injury injury, Integer id){
        return injuryServices.update(injury, id);
    }

    @DeleteMapping("injury/{id}")
    public String deleteInjuryById(Integer id){
        return injuryServices.delete(id);
    }
}
