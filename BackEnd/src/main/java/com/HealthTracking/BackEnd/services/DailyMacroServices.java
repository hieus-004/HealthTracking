package com.HealthTracking.BackEnd.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.DailyMacro;
import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.dto.DailyMacroRequest;
import com.HealthTracking.BackEnd.model.dto.UpdateMacroRequest;
import com.HealthTracking.BackEnd.model.dto.WeeklyMacroResponse;
import com.HealthTracking.BackEnd.repo.DailyMacroRepo;
import com.HealthTracking.BackEnd.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class DailyMacroServices {

    @Autowired
    private DailyMacroRepo dailyMacroRepo;

    @Autowired
    private UserRepo userRepo;

    public List<DailyMacro> getAll() {
        return dailyMacroRepo.findAll();
    }

    public DailyMacro getById(Integer id) {
        return dailyMacroRepo.findById(id).orElse(null);
    }

    public String update(UpdateMacroRequest dailyMacro, LocalDate targetDate) {
        DailyMacro mc = dailyMacroRepo.findById(dailyMacro.getMacroId()).orElse(null);
        if (mc != null) {
            mc.setCCarb(dailyMacro.getCCarb());
            mc.setCFat(dailyMacro.getCFat());
            mc.setCProtein(dailyMacro.getCProtein());
            mc.setCKcal(dailyMacro.getCKcal());
            dailyMacroRepo.save(mc);
            return "Daily macro updated";
        }
        return ("Update failed");
    }

    public String save(DailyMacroRequest dailyMacro, LocalDate targetDate) {
        DailyMacro mc = new DailyMacro();
        mc.setCCarb(dailyMacro.getCCarb());
        mc.setCFat(dailyMacro.getCFat());
        mc.setCKcal(dailyMacro.getCKcal());
        mc.setCProtein(dailyMacro.getCProtein());
        mc.setDate(targetDate);
        mc.setTCarb(dailyMacro.getTCarb());
        mc.setTFat(dailyMacro.getTFat());
        mc.setTKcal(dailyMacro.getTKcal());
        mc.setTProtein(dailyMacro.getTProtein());
        User user = userRepo.findById(dailyMacro.getUserId()).orElse(null);
        mc.setUser(user);

        dailyMacroRepo.save(mc);
        return ("Post method is called");
    }

    public String delete(Integer id) {
        dailyMacroRepo.deleteById(id);
        return ("Delete method is called");
    }

    @Transactional
    public String saveOrUpdateMacro(DailyMacroRequest request, LocalDate date) {
        // 1. Backend tự đi tìm xem ngày này User đã có bản ghi chưa
        DailyMacro existingMacro = dailyMacroRepo.findByUser_UserIdAndDate(request.getUserId(), date);

        if (existingMacro != null) {
            // ĐÃ TỒN TẠI -> THỰC HIỆN UPDATE
            existingMacro.setCKcal(request.getCKcal());
            existingMacro.setCProtein(request.getCProtein());
            existingMacro.setCCarb(request.getCCarb());
            existingMacro.setCFat(request.getCFat());
            // Hàm save lúc này sẽ tự hiểu là Update vì Object đã có ID
            dailyMacroRepo.save(existingMacro);
            return "Đã cập nhật Macro thành công";
        } else {
            // CHƯA TỒN TẠI -> THỰC HIỆN INSERT MỚI
            User user = userRepo.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

            DailyMacro newMacro = new DailyMacro();
            newMacro.setUser(user);
            newMacro.setDate(date);
            newMacro.setTKcal(request.getTKcal());
            newMacro.setTProtein(request.getTProtein());
            newMacro.setTCarb(request.getTCarb());
            newMacro.setTFat(request.getTFat());
            newMacro.setCKcal(request.getCKcal());
            newMacro.setCProtein(request.getCProtein());
            newMacro.setCCarb(request.getCCarb());
            newMacro.setCFat(request.getCFat());

            dailyMacroRepo.save(newMacro);
            return "Đã tạo mới Macro thành công";
        }
    }

    public List<WeeklyMacroResponse> getWeeklyMacroFlow(Integer userId, LocalDate endDate) {
        // 1. Tính ra ngày bắt đầu (Lùi lại 6 ngày để lấy trọn vẹn 7 ngày bao gồm cả
        // endDate)
        LocalDate startDate = endDate.minusDays(6);

        // 2. Query Database lấy dữ liệu thực tế đã lưu
        List<DailyMacro> existingRecords = dailyMacroRepo.findByUser_UserIdAndDateBetweenOrderByDateAsc(userId,
                startDate, endDate);

        Map<LocalDate, DailyMacro> recordMap = existingRecords.stream()
                .collect(Collectors.toMap(
                        DailyMacro::getDate,
                        record -> record,
                        // THÊM ĐOẠN NÀY ĐỂ FIX LỖI DUPLICATE KEY
                        (existing, replacement) -> existing));

        // 4. Tạo mảng kết quả 7 ngày
        List<WeeklyMacroResponse> weeklyData = new ArrayList<>();

        // Lặp đúng 7 vòng (Từ ngày bắt đầu đến ngày kết thúc)
        for (int i = 0; i <= 6; i++) {
            LocalDate currentDate = startDate.plusDays(i);

            // Lấy bản ghi thực tế từ Map ra (nếu có)
            DailyMacro record = recordMap.get(currentDate);

            if (record != null) {
                // NẾU CÓ DỮ LIỆU: Lấy số thực tế
                weeklyData.add(new WeeklyMacroResponse(
                        currentDate.toString(),
                        record.getCKcal() != null ? record.getCKcal() : 0.0,
                        record.getTKcal() != null ? record.getTKcal() : 2000.0 // Mục tiêu calo (Nếu null thì cho mặc
                                                                               // định 2000)
                ));
            } else {
                // NẾU KHÔNG CÓ DỮ LIỆU (User bỏ quên không nhập): Tạo một bản ghi ảo chứa số 0
                weeklyData.add(new WeeklyMacroResponse(
                        currentDate.toString(),
                        0.0, // Ngày này chưa ăn gì -> 0 Calo
                        2000.0 // Mục tiêu mặc định vẫn là 2000
                ));
            }
        }

        return weeklyData;
    }

    public String deleteAll() {
        dailyMacroRepo.deleteAll();
        return "deleted all macro log";
    }
}
