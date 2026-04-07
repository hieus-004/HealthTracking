package com.HealthTracking.BackEnd.model.dto;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AgentRequest {
    private String answer;
    private DailyMacroResponse dailyMacro;

}
