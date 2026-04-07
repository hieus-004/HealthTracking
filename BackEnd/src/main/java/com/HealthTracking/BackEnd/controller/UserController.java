package com.HealthTracking.BackEnd.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.dto.UserBodyResponse;
import com.HealthTracking.BackEnd.services.UserServices;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public String updateUser(@RequestBody User user) {
        return userServices.updateUser(user);
    }

    @DeleteMapping("user/{id}")
    public String deleteuser(@PathVariable Integer id) {
        userServices.deleteUserById(id);
        return "DELETE method is called";
    }

    @GetMapping("user/{id}/bodyInfo")
    public ResponseEntity<UserBodyResponse> getBodyInfo(@PathVariable Integer id) {
        UserBodyResponse response = userServices.getBodyInfo(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("user/{id}/bodyInfo")
    public ResponseEntity<UserBodyResponse> updateBodyInfo(@PathVariable Integer id, @Valid @RequestBody UserBodyResponse bodyInfo) {
        UserBodyResponse updatedInfo = userServices.updateBodyInfo(id, bodyInfo);
        // Trả về 200 OK kèm data mới nhất
        return ResponseEntity.ok(updatedInfo); 
    }

}   
