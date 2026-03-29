package com.HealthTracking.BackEnd.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.dto.UserBodyResponse;
import com.HealthTracking.BackEnd.repo.BodyRepo;
import com.HealthTracking.BackEnd.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServices {

    
    private final UserRepo userRepo;
    private final BodyRepo bodyRepo;



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

    public String updateUser(User user) {
        User existing = userRepo.findById(user.getUserId()).orElse(null);

        if(existing != null){
            existing.setAge(user.getAge());
            existing.setEmail(user.getEmail());
            existing.setGender(user.getGender());
            existing.setPhoneNumber(user.getPhoneNumber());
            existing.setUserName(user.getUserName());
            
            userRepo.save(existing);
            return ("Put method is called");
        }
        return ("Put method failed");

    }

    public UserBodyResponse getBodyInfo(Integer id) {
        User user = userRepo.findById(id).orElse(null);
        if(user == null) return null;
        UserBodyResponse response = new UserBodyResponse();
        response.setUserName(user.getUserName());
        response.setAge(user.getAge());
        response.setGender(user.getGender());
        response.setActivityLevel(user.getActivityLevel());
        bodyRepo.findFirstByUser_UserIdOrderByTimestampDesc(id).ifPresent(body -> {
            response.setWeight(body.getWeight().doubleValue());
            response.setHeight(body.getHeight().doubleValue());
            response.setBodyfatPerc(body.getBodyfatPerc());
            response.setSmm(body.getSmm());
            response.setTarget(body.getTarget());
        });
        return response;
    }

    

}
