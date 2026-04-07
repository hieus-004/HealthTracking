package com.HealthTracking.BackEnd.model.dto;

import java.util.List;

import com.HealthTracking.BackEnd.model.ChatLog;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class chatbotRequest {
    private UserMacroContext context;
    private List<ChatLog> chatLog;
    private String message;
    private String constraint;
}
