package com.HealthTracking.BackEnd.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.DailyMacro;
import com.HealthTracking.BackEnd.model.dto.DailyMacroRequest;
import com.HealthTracking.BackEnd.model.dto.UpdateMacroRequest;
import com.HealthTracking.BackEnd.services.DailyMacroServices;

@RestController
@RequestMapping("/api")
public class DailyMacroController {

    @Autowired
    private DailyMacroServices dailyMacroServices;

    @GetMapping("dailyMacro")
    public List<DailyMacro> getAllDailyMacro() {
        return dailyMacroServices.getAll();
    }

    @GetMapping("dailyMacro/{id}")
    public DailyMacro getDailyMacroById(@PathVariable Integer id) {
        return dailyMacroServices.getById(id);
    }

    @PutMapping("dailyMacro/{id}")
    public String updateDailyMacroById(@RequestBody UpdateMacroRequest dailyMacro,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        System.out.println(targetDate);
        return dailyMacroServices.update(dailyMacro, targetDate);
    }

    // @PostMapping("dailyMacro")
    // public String saveDailyMacro(@RequestBody DailyMacroRequest dailyMacro,
    // @RequestParam(required = false) @DateTimeFormat(iso =
    // DateTimeFormat.ISO.DATE) LocalDate date) {
    // LocalDate targetDate = (date != null) ? date : LocalDate.now();
    // System.out.println(targetDate);
    // return dailyMacroServices.save(dailyMacro, targetDate);
    // }

    @PostMapping("dailyMacro")
    public String saveDailyMacro(@RequestBody DailyMacroRequest dailyMacro,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        return dailyMacroServices.saveOrUpdateMacro(dailyMacro, targetDate);
    }

    @DeleteMapping("dailyMacro/{id}")
    public String deleteDailyMacroById(@PathVariable Integer id) {
        return dailyMacroServices.delete(id);
    }

    @DeleteMapping("dailyMacro")
    public String deleteAllDailyMacro() {
        return dailyMacroServices.deleteAll();
    }
}
