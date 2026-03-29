package com.HealthTracking.BackEnd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.DailyMacro;
import com.HealthTracking.BackEnd.services.DailyMacroServices;

@RestController
@RequestMapping("/api")
public class DailyMacroController {

    @Autowired
    private DailyMacroServices dailyMacroServices;

    @GetMapping("dailyMacro")
    public List<DailyMacro> getAllDailyMacro(){
        return dailyMacroServices.getAll();
    }

    @GetMapping("dailyMacro/{id}")
    public DailyMacro getDailyMacroById(@PathVariable Integer id){
        return dailyMacroServices.getById(id);
    }

    @PutMapping("dailyMacro/{id}")
    public String updateDailyMacroById(@RequestBody DailyMacro dailyMacro, @PathVariable Integer id){
        return dailyMacroServices.update(dailyMacro, id);
    }

    @PostMapping("dailyMacro")
    public String saveDailyMacro(@RequestBody DailyMacro dailyMacro){
        return dailyMacroServices.save(dailyMacro);
    }

    @DeleteMapping("dailyMacro/{id}")
    public String deleteDailyMacroById(@PathVariable Integer id){
        return dailyMacroServices.delete(id);
    }
}
