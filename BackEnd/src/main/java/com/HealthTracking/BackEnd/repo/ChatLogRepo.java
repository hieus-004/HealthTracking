package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.ChatLog;

@Repository
public interface ChatLogRepo extends JpaRepository<ChatLog, Integer>{

}
