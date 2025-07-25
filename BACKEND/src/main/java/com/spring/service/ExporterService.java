package com.spring.service;

import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderDetailDTO;
import com.spring.dto.InventoryLogsDTO;

import java.util.List;

public interface ExporterService {
    /**
     * Lấy danh sách tất cả các yêu cầu xuất hàng (đơn hàng ở trạng thái Pending).
     * @return Danh sách ExporterDTO chứa thông tin các yêu cầu xuất hàng.
     */
    List<ExporterDTO> getAllExportRequests();

    /**
     * Lấy thông tin yêu cầu xuất hàng theo ID đơn hàng.
     * @param orderId ID của đơn hàng
     * @return ExporterDTO chứa thông tin yêu cầu xuất hàng, hoặc null nếu không tìm thấy
     */
    ExporterDTO getExportRequestById(int orderId);

    /**
     * Tạo yêu cầu xuất hàng mới dựa trên thông tin từ đơn hàng gốc và các thông tin bổ sung.
     * @param exporterDTO Thông tin yêu cầu xuất hàng (chứa thông tin từ đơn hàng gốc và thông tin bổ sung như shippingMethodID, driverID, v.v.)
     * @param orderDetails Danh sách chi tiết đơn hàng từ đơn hàng gốc
     */
    void createExportRequest(ExporterDTO exporterDTO, List<OrderDetailDTO> orderDetails);

    /**
     * Hủy yêu cầu xuất hàng với lý do và ID của Exporter.
     * @param orderId ID của đơn hàng
     * @param cancelReason Lý do hủy
     * @param exporterId ID của Exporter
     */
    void cancelExportRequest(int orderId, String cancelReason, int exporterId);

    /**
     * Kiểm tra tính khả dụng của tồn kho cho sản phẩm với số lượng yêu cầu.
     * @param productId ID của sản phẩm
     * @param quantity Số lượng cần kiểm tra
     * @return true nếu tồn kho đủ, false nếu không đủ
     */
    boolean checkInventoryAvailability(int productId, int quantity);

    /**
     * Xác nhận đơn hàng xuất với ID của Exporter.
     * @param orderId ID của đơn hàng
     * @param exporterId ID của Exporter
     */
    void confirmOrder(int orderId, int exporterId);

    /**
     * Từ chối đơn hàng xuất với lý do và ID của Exporter.
     * @param orderId ID của đơn hàng
     * @param rejectReason Lý do từ chối
     * @param exporterId ID của Exporter
     */
    void rejectOrder(int orderId, String rejectReason, int exporterId);

    /**
     * Lấy lịch sử xuất hàng dựa trên productId hoặc orderId.
     * @param productId ID của sản phẩm (0 nếu không lọc theo sản phẩm)
     * @param orderId ID của đơn hàng (0 nếu không lọc theo đơn hàng)
     * @return Danh sách InventoryLogsDTO chứa lịch sử xuất hàng
     */
    List<InventoryLogsDTO> getExportHistory(int productId, int orderId);
}