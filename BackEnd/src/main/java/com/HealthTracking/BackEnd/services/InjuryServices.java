package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Injury;
import com.HealthTracking.BackEnd.repo.InjuryRepo;

@Service
public class InjuryServices {

    @Autowired
    private InjuryRepo injuryRepo;

    public List<Injury> getAll() {
        return injuryRepo.findAll();
    }

    public Injury getById(Integer id) {
        return injuryRepo.findById(id).orElse(null);
    }

    public String save(Injury injury) {
        injuryRepo.save(injury);
        return ("Post method is called");
    }

    public String update(Injury injury, Integer id) {
        if (injuryRepo.findById(id) != null){
            injuryRepo.save(injury);
            return ("Put method is called");
        }
        return("Failed to update injury");
    }

    public String delete(Integer id) {
        injuryRepo.deleteById(id);
        return ("Delete method is called");
    }


}
