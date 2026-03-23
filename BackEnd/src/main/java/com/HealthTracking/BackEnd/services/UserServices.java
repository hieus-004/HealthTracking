package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.repo.UserRepo;

@Service
public class UserServices {

    @Autowired
    private UserRepo userRepo;

    public List<User> getAllUser() {
        return userRepo.findAll();
    }

    public User getUserById(Integer id) {
        return userRepo.findById(id).orElse(null);
    }


    public void deleteUserById(Integer id) {
        userRepo.deleteById(id);
    }

    public void createUser(User user) {
        userRepo.save(user);
    }

    public void updateUser(User user) {
    
    }

}
