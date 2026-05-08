package com.HealthTracking.BackEnd.repo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthTracking.BackEnd.model.DailyMacro;

@Repository
public interface DailyMacroRepo extends JpaRepository<DailyMacro, Integer> {
    Optional<DailyMacro> findFirstByUser_UserIdAndDate(Integer id, LocalDate today);

    DailyMacro findByUser_UserIdAndDate(Integer userId, LocalDate date);

    // Tìm các bản ghi của User trong 1 khoảng thời gian (Từ ngày A đến ngày B), sắp xếp tăng dần theo ngày
    List<DailyMacro> findByUser_UserIdAndDateBetweenOrderByDateAsc(Integer userId, LocalDate startDate, LocalDate endDate);

}
