import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ExporterSetting = () => {
  const [disableReason, setDisableReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.userId;
  const roleID = userData?.roleID;

  const handleDisableAccount = async () => {
    if (!userId || roleID !== 5) {
      Swal.fire({
        icon: "error",
        title: "Không có quyền",
        text: "Vui lòng đăng nhập với tài khoản Exporter hoặc thử lại.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!disableReason) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu lý do",
        text: "Vui lòng chọn lý do vô hiệu hóa tài khoản.",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận vô hiệu hóa tài khoản",
      text: "Tài khoản của bạn sẽ bị tạm dừng. Bạn có thể đăng nhập lại để kích hoạt.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vô hiệu hóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.put(
        "http://localhost:8082/PureFoods/api/users/deactivate",
        { userId, reason: disableReason },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      if (response.data.status === 200) {
        toast.success("Tài khoản đã được vô hiệu hóa.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error(response.data.message || "Vô hiệu hóa tài khoản thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi vô hiệu hóa tài khoản: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId || roleID !== 5) {
      Swal.fire({
        icon: "error",
        title: "Không có quyền",
        text: "Vui lòng đăng nhập với tài khoản Exporter hoặc thử lại.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!deleteReason) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu lý do",
        text: "Vui lòng chọn lý do xóa tài khoản.",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận xóa tài khoản",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        "http://localhost:8082/PureFoods/api/users/delete",
        { data: { userId, reason: deleteReason }, headers: { Authorization: `Bearer ${userData.token}` } }
      );
      if (response.data.status === 200) {
        toast.success("Tài khoản đã được xóa.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error(response.data.message || "Xóa tài khoản thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi xóa tài khoản: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="dashboard-privacy">
      <div className="title">
        <h2>Cài đặt</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>

      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Thông báo</h3>
        </div>
        {[
          "Hiện thông báo lên màn hình chính",
          "Bật thông báo",
          "Nhận thông báo cho các hoạt động của tôi",
          "Không làm phiền (DND)",
        ].map((label, index) => (
          <div key={index} className="privacy-box">
            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
              <input
                className="form-check-input"
                type="radio"
                id={`option-${index}`}
                name="desktop"
                defaultChecked={index === 0}
              />
              <label className="form-check-label ms-2" htmlFor={`option-${index}`}>
                {label}
              </label>
            </div>
          </div>
        ))}
        <button className="btn theme-bg-color btn-md fw-bold mt-4 text-white">Lưu thay đổi</button>
      </div>

      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Vô hiệu hóa tài khoản</h3>
        </div>
        {["Tôi có mối lo ngại về quyền riêng tư", "Đây chỉ là tạm thời", "Lý do khác"].map((label, index) => (
          <div key={index} className="privacy-box">
            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
              <input
                className="form-check-input"
                type="radio"
                id={`disable-${index}`}
                name="concern"
                onChange={() => setDisableReason(label)}
              />
              <label className="form-check-label ms-2" htmlFor={`disable-${index}`}>
                {label}
              </label>
            </div>
          </div>
        ))}
        <button
          style={{ backgroundColor: "#FFE57F" }}
          className="btn btn-md fw-bold mt-4 text-black"
          onClick={handleDisableAccount}
        >
          Vô hiệu hóa tài khoản
        </button>
      </div>

      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Xóa tài khoản</h3>
        </div>
        {["Không còn sử dụng nữa", "Muốn chuyển sang tài khoản khác", "Lý do khác"].map((label, index) => (
          <div key={index} className="privacy-box">
            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
              <input
                className="form-check-input"
                type="radio"
                id={`delete-${index}`}
                name="usable"
                onChange={() => setDeleteReason(label)}
              />
              <label className="form-check-label ms-2" htmlFor={`delete-${index}`}>
                {label}
              </label>
            </div>
          </div>
        ))}
        <button
          style={{ backgroundColor: "red" }}
          className="btn btn-md fw-bold mt-4 text-white"
          onClick={handleDeleteAccount}
        >
          Xóa tài khoản của tôi
        </button>
      </div>
    </div>
  );
};

export default ExporterSetting;