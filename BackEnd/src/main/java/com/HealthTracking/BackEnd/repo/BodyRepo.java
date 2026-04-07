package com.HealthTracking.BackEnd.repo;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.Body;
import com.HealthTracking.BackEnd.model.User;

@Repository
public interface BodyRepo extends JpaRepository<Body, Integer> {

    Optional<Body> findFirstByUser_UserIdOrderByTimestampDesc(Integer userId);

    List<Body> findAllByUser_UserIdOrderByTimestampAsc(Integer id);

    Optional<User> findFirstDailyMacroByUser_UserIdAndTimestampBetweenOrderByTimestampDesc(Integer id,
            OffsetDateTime atOffset, OffsetDateTime atOffset2);

}
