package com.HealthTracking.BackEnd.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.services.UserServices;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserServices userServices;

    @GetMapping("user")
    public List<User> getAllUser() {
        return userServices.getAllUser();
    }
    
    @GetMapping("user/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userServices.getUserById(id);
    }

    @PostMapping("user")
    public String postMethodName(@RequestBody User user) {
        userServices.createUser(user);
        return "Post method is called";
    }
    
    @PutMapping("user")
    public String putMethodName(@PathVariable String id, @RequestBody User user) {
        userServices.updateUser(user);
        return "PUT method is called";
    }

    @DeleteMapping("user/{id}")
    public String deleteuser(@PathVariable Integer id) {
        userServices.deleteUserById(id);
        return "DELETE method is called";
    }
}
