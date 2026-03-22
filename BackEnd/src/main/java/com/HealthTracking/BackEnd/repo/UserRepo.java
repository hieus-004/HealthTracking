package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

}
