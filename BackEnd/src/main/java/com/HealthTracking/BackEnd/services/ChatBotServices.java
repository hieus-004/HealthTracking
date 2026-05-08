package com.HealthTracking.BackEnd.services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.HealthTracking.BackEnd.model.dto.AgentRequest;
import com.HealthTracking.BackEnd.model.dto.DailyMacroResponse;


@Service
public class ChatBotServices {

    @Autowired
    private NutriServices nutriServices;

    RestClient client = RestClient.create();

    public String chatBotInvoke(String message, Integer id) {
        // 1. Đóng gói Request kèm theo bối cảnh dinh dưỡng
        AgentRequest req = new AgentRequest();
        req.setAnswer(message);
        LocalDate today = LocalDate.now();
        // Lấy thông tin dinh dưỡng hiện tại của user để gửi kèm
        DailyMacroResponse macro = nutriServices.getTodayMacro(id, today);
        req.setDailyMacro(macro);
        try {
            // 2. Gửi POST request kèm Body
            AgentRequest res = client.post()
                .uri("http://127.0.0.1:5001/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .body(req) // QUAN TRỌNG: Phải gửi object req đi
                .retrieve()
                .body(AgentRequest.class);

            return (res != null) ? res.getAnswer() : "AI đang bận xử lý dữ liệu...";
        } catch (Exception e) {
            return "Lỗi kết nối AI Terminal: " + e.getMessage();
        }
    }
}
