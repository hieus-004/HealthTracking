package com.HealthTracking.BackEnd.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthTracking.BackEnd.model.Injury;
import com.HealthTracking.BackEnd.model.Joints;
import com.HealthTracking.BackEnd.model.User;
import com.HealthTracking.BackEnd.model.dto.InjuryHistoryResponse;
import com.HealthTracking.BackEnd.model.dto.InjuryRequest;
import com.HealthTracking.BackEnd.model.dto.InjuryResponse;
import com.HealthTracking.BackEnd.repo.InjuryRepo;
import com.HealthTracking.BackEnd.repo.JointRepo;
import com.HealthTracking.BackEnd.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class InjuryServices {

    @Autowired
    private InjuryRepo injuryRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JointRepo jointRepo;

    public List<Injury> getAll() {
        return injuryRepo.findAll();
    }

    public Injury getById(Integer id) {
        return injuryRepo.findById(id).orElse(null);
    }

    public String save(Injury injury) {
        injuryRepo.save(injury);
        return ("Post method is called");
    }

    public String update(Injury injury, Integer id) {
        if (injuryRepo.findById(id) != null) {
            injuryRepo.save(injury);
            return ("Put method is called");
        }
        return ("Failed to update injury");
    }

    public String delete(Integer id) {
        injuryRepo.deleteById(id);
        return ("Delete method is called");
    }

    @Transactional // Vẫn bắt buộc phải có
    public String saveInjuryLog(List<InjuryRequest> injuryRequests) {

        // 1. Chống lỗi Null Pointer
        if (injuryRequests == null || injuryRequests.isEmpty()) {
            return "Không có dữ liệu để xử lý.";
        }

        // Lấy thông tin chung từ phần tử đầu tiên
        Integer userId = injuryRequests.get(0).getUserId();
        LocalDate targetDate = injuryRequests.get(0).getTimestamp();

        // 🚀 BƯỚC 3 CỦA ÔNG ĐÂY: XỬ LÝ TÍN HIỆU "XÓA TRẮNG" TỪ REACT
        if (injuryRequests.size() == 1 && injuryRequests.get(0).getJointId() == -1) {
            // Thực hiện quét sạch dữ liệu chấn thương của ngày hôm đó
            injuryRepo.deleteByUserIdAndDate(userId, targetDate);

            // Return luôn, KHÔNG chạy xuống đoạn code lưu mới (saveAll) ở dưới nữa
            return "Đã xóa toàn bộ chấn thương. Báo cáo khỏi bệnh thành công!";
        }

        // ---------------------------------------------------------
        // NẾU KHÔNG PHẢI LÀ XÓA TRẮNG, THÌ THỰC HIỆN LƯU BÌNH THƯỜNG
        // ---------------------------------------------------------

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        // Xóa sạch bản ghi cũ của ngày hôm nay đi để chuẩn bị ghi đè cái mới
        injuryRepo.deleteByUserIdAndDate(userId, targetDate);

        // Chuẩn bị mảng để lưu mới
        List<Injury> injuriesToSave = new ArrayList<>();

        for (InjuryRequest request : injuryRequests) {
            // Móc Object Joints từ DB lên
            Joints joint = jointRepo.findById(request.getJointId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Khớp có ID: " + request.getJointId()));

            Injury newInjury = new Injury();
            newInjury.setUser(user);
            newInjury.setJoint(joint);
            newInjury.setTimestamp(request.getTimestamp());
            newInjury.setInjuryScale(request.getInjuryScale());
            newInjury.setInjuryName(joint.getJointName());

            injuriesToSave.add(newInjury);
        }

        // Lưu hàng loạt vào DB
        injuryRepo.saveAll(injuriesToSave);

        return "Đã đồng bộ thành công " + injuriesToSave.size() + " vị trí chấn thương!";
    }

    public List<InjuryHistoryResponse> getInjuryHistory(Integer userId) {
        // Lấy toàn bộ lịch sử trong 30 ngày qua
        List<Injury> history = injuryRepo.findByUser_UserIdAndTimestampAfterOrderByTimestampAsc(
                userId, LocalDate.now().minusDays(30));

        // Nhóm dữ liệu theo ngày
        Map<LocalDate, Map<String, Integer>> groupedData = history.stream()
                .collect(Collectors.groupingBy(
                        Injury::getTimestamp,
                        Collectors.toMap(
                                i -> i.getJoint().getJointName(),
                                Injury::getInjuryScale,
                                (existing, replacement) -> replacement // Nếu một ngày có 2 bản ghi cùng khớp, lấy cái
                                                                       // mới nhất
                        )));

        // Chuyển sang List DTO để Frontend dễ dùng
        return groupedData.entrySet().stream()
                .map(entry -> new InjuryHistoryResponse(entry.getKey().toString(), entry.getValue()))
                .sorted(Comparator.comparing(InjuryHistoryResponse::getDate))
                .collect(Collectors.toList());
    }

    public List<InjuryResponse> getMostRecent(Integer userId) {
        // 1. Lấy toàn bộ các bản ghi của ngày Sync cuối cùng (Sẽ có các bản ghi bị
        // trùng do ấn Sync nhiều lần)
        List<Injury> rawInjuries = injuryRepo.findLatestInjuriesByUserId(userId);

        // 2. Dùng Map (Từ điển) để lọc trùng.
        // Key là jointId, Value là cái DTO trả về.
        // Nếu vòng lặp gặp 1 cái Khớp đã có trong Map, nó sẽ đè cái mới lên cái cũ.
        // Kết quả: Ta luôn luôn lấy được mức độ đau của LẦN SYNC CUỐI CÙNG trong ngày.
        Map<Integer, InjuryResponse> uniqueInjuries = new HashMap<>();

        for (Injury inj : rawInjuries) {
            Integer jId = inj.getJoint().getJointId(); // Rút lấy đúng cái số ID của khớp
            Integer scale = inj.getInjuryScale();

            uniqueInjuries.put(jId, new InjuryResponse(jId, scale));
        }

        // 3. Trả về một List sạch sẽ, không trùng lặp, đúng định dạng React cần
        return new ArrayList<>(uniqueInjuries.values());
    }

    public String deleteAll() {
        injuryRepo.deleteAll();
        return "All injuries deleted successfully.";
    }

}
