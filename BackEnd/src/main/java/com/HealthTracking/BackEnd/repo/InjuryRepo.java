package com.HealthTracking.BackEnd.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.Injury;

@Repository
public interface InjuryRepo extends JpaRepository<Injury, Integer> {
    // Trong InjuryRepository.java
    @Query(value = "SELECT * FROM injury WHERE user_id = :userId AND timestamp = (SELECT MAX(timestamp) FROM injury WHERE user_id = :userId)", nativeQuery = true)
    List<Injury> findLatestInjuriesByUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("DELETE FROM Injury i WHERE i.user.userId = :userId AND i.timestamp = :date")
    void deleteByUserIdAndDate(@Param("userId") Integer userId, @Param("date") LocalDate date);

    List<Injury> findByUser_UserIdAndTimestampAfterOrderByTimestampAsc(Integer userId, LocalDate minusDays);
}
