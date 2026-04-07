package com.HealthTracking.BackEnd.services;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Body;
import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.dto.UserBodyResponse;
import com.HealthTracking.BackEnd.repo.BodyRepo;
import com.HealthTracking.BackEnd.repo.UserRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

    @Transactional
    public UserBodyResponse getBodyInfo(Integer id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng!"));

        // Lấy bản ghi body mới nhất (nếu có)
        Body latestBody = bodyRepo.findFirstByUser_UserIdOrderByTimestampDesc(id).orElse(null);

        return mapToResponse(user, latestBody);
    }

    @Transactional
    public UserBodyResponse updateBodyInfo(Integer id, UserBodyResponse bodyInfo) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng!"));

        // 1. Cập nhật Profile User (Ghi đè)
        user.setUserName(bodyInfo.getUserName());
        user.setAge(bodyInfo.getAge());
        user.setGender(bodyInfo.getGender());
        user.setActivityLevel(bodyInfo.getActivityLevel());
        userRepo.save(user);

        // 2. Lưu nhật ký Metric mới (Thêm mới)
        Body newBody = new Body();
        newBody.setUser(user);
        newBody.setWeight(bodyInfo.getWeight());
        newBody.setHeight(bodyInfo.getHeight());
        newBody.setBodyfatPerc(bodyInfo.getBodyfatPerc());
        newBody.setSmm(bodyInfo.getSmm());
        newBody.setTarget(bodyInfo.getTarget());
        newBody.setTimestamp(OffsetDateTime.now()); 
        newBody.setTargetIntensity(bodyInfo.getTargetIntensity());

        bodyRepo.save(newBody);

        // 3. Trả về chính Response mới nhất để Frontend cập nhật UI
        return mapToResponse(user, newBody);
    }

    // HÀM HELPER: Trái tim của sự tối ưu
    private UserBodyResponse mapToResponse(User user, Body body) {
        UserBodyResponse response = new UserBodyResponse();
        
        // Map thông tin từ User
        response.setUserName(user.getUserName());
        response.setAge(user.getAge());
        response.setGender(user.getGender());
        response.setActivityLevel(user.getActivityLevel());

        // Map thông tin từ Body (nếu có dữ liệu)
        if (body != null) {
            double w = body.getWeight();
            double h = body.getHeight();
            
            response.setWeight(w);
            response.setHeight(h);
            response.setBodyfatPerc(body.getBodyfatPerc());
            response.setSmm(body.getSmm());
            response.setTarget(body.getTarget());
            response.setTargetIntensity(body.getTargetIntensity());

            // Tự động tính BMI để Frontend không phải làm
            if (h > 0) {
                double bmi = w / Math.pow(h / 100, 2);
                response.setBmi(Math.round(bmi * 10.0) / 10.0);
            }
        }
        return response;
    }

    

}
