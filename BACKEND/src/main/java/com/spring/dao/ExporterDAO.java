package com.spring.dao;

import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderDetailDTO;
import com.spring.dto.InventoryLogsDTO;

import java.util.List;

public interface ExporterDAO {
    /**
     * Lấy danh sách tất cả các yêu cầu xuất hàng.
     */
    List<ExporterDTO> getAllExportRequests();

    /**
     * Lấy thông tin yêu cầu xuất hàng theo orderId.
     */
    ExporterDTO getExportRequestById(int orderId);

    /**
     * Tạo yêu cầu xuất hàng mới dựa trên ExporterDTO và danh sách chi tiết đơn hàng.
     * @param exporterDTO Thông tin yêu cầu xuất hàng
     * @param orderDetails Danh sách chi tiết đơn hàng từ đơn hàng gốc
     */
    void createExportRequest(ExporterDTO exporterDTO, List<OrderDetailDTO> orderDetails);

    /**
     * Hủy yêu cầu xuất hàng với lý do và ID của Exporter.
     */
    void cancelExportRequest(int orderId, String cancelReason, int exporterId);

    /**
     * Kiểm tra tính khả dụng của tồn kho cho sản phẩm với số lượng yêu cầu.
     */
    boolean checkInventoryAvailability(int productId, int quantity);

    /**
     * Xác nhận đơn hàng xuất với ID của Exporter.
     */
    void confirmOrder(int orderId, int exporterId);

    /**
     * Từ chối đơn hàng xuất với lý do và ID của Exporter.
     */
    void rejectOrder(int orderId, String rejectReason, int exporterId);

    /**
     * Lấy lịch sử xuất hàng dựa trên productId và orderId.
     */
    List<InventoryLogsDTO> getExportHistory(int productId, int orderId);
}