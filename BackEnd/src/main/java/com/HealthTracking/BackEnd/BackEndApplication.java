package com.HealthTracking.BackEnd;

import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.repo.UserRepo;

@SpringBootApplication
public class BackEndApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(BackEndApplication.class, args);

		UserRepo repo = context.getBean(UserRepo.class);

		// User u1 = context.getBean(User.class);
		// u1.setUserId("1");
		// u1.setDateOfBirth("2");
		// u1.setEmail("3");
		// u1.setGender("4");
		// u1.setName("null");
		// u1.setPassword("null");
		// u1.setPhoneNumber("null");
	
		// repo.save(u1);

		List<User> ls = repo.findAll();
		System.out.println(ls);
	}

}
