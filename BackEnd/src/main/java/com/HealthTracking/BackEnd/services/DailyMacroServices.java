package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.DailyMacro;
import com.HealthTracking.BackEnd.repo.DailyMacroRepo;

@Service
public class DailyMacroServices {

    @Autowired
    private DailyMacroRepo dailyMacroRepo;

    public List<DailyMacro> getAll() {
        return dailyMacroRepo.findAll();
    }

    public DailyMacro getById(Integer id) {
        return dailyMacroRepo.findById(id).orElse(null);
    }

    public String update(DailyMacro dailyMacro, Integer id) {
        if (dailyMacroRepo.findById(id) != null){
            dailyMacroRepo.save(dailyMacro);
            return ("Put dailyMacro is called");
        }
        return("Failed to update dailyMacro");
    }

    public String save(DailyMacro dailyMacro) {
        dailyMacroRepo.save(dailyMacro);
        return ("Post method is called");
    }

    public String delete(Integer id) {
        dailyMacroRepo.deleteById(id);
        return ("Delete method is called");
    }
}
