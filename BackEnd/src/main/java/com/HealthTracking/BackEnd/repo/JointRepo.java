package com.HealthTracking.BackEnd.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.Joints;

@Repository
public interface JointRepo extends JpaRepository<Joints, Integer>{

}
