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

import com.HealthTracking.BackEnd.model.Injury;
import com.HealthTracking.BackEnd.model.dto.InjuryHistoryResponse;
import com.HealthTracking.BackEnd.model.dto.InjuryRequest;
import com.HealthTracking.BackEnd.model.dto.InjuryResponse;
import com.HealthTracking.BackEnd.services.InjuryServices;

@RestController
@RequestMapping("/api")
public class InjuryController {

    @Autowired
    private InjuryServices injuryServices;

    @GetMapping("injury/{id}")
    public List<InjuryResponse> getAllInjury(@PathVariable Integer id){
        return injuryServices.getMostRecent(id);
    }


    @PutMapping("injury/{id}")
    public String updateInjuryById(Injury injury, Integer id){
        return injuryServices.update(injury, id);
    }

    @DeleteMapping("injury/{id}")
    public String deleteInjuryById(Integer id){
        return injuryServices.delete(id);
    }

    @DeleteMapping("injury")
    public String deleteAllInjury() {
        return injuryServices.deleteAll();
    }

    @PostMapping("injury")
    public String saveInjury(@RequestBody List<InjuryRequest> injury) {
        return injuryServices.saveInjuryLog(injury);
    }

    //const res = await axiosClient.get(`/api/injury/history/${userId}`);
    @GetMapping("injury/history/{id}")
    public List<InjuryHistoryResponse> getInjuryHistory(@PathVariable Integer id){
        return injuryServices.getInjuryHistory(id);
    }
    
}
