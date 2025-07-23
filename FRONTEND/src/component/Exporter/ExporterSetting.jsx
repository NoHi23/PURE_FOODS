import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ExporterSetting = () => {
  const [disableReason, setDisableReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.userID;

  const handleDisableAccount = async () => {
    if (!userId) {
      toast.error("Không tìm thấy thông tin người dùng.");
      return;
    }

    if (!disableReason) {
      toast.warn("Hãy chọn lý do bạn muốn vô hiệu hoá tài khoản nhé 😢");
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận vô hiệu hoá tài khoản",
      text: "Tài khoản của bạn sẽ bị tạm dừng. Bạn có thể đăng nhập lại bất cứ lúc nào để kích hoạt lại.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vô hiệu hoá",
      cancelButtonText: "Huỷ thao tác",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.put("http://localhost:8082/PureFoods/api/users/profile/update", { 
        userId, 
        status: 1 
      });
      if (response.data?.status === 200) {
        toast.success("Tài khoản của bạn đã được vô hiệu hoá. Bạn có thể đăng nhập lại bất cứ lúc nào để kích hoạt.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error("Vô hiệu hoá tài khoản thất bại: " + (response.data.message || "Lỗi không xác định"));
      }
    } catch (err) {
      toast.error("Lỗi khi vô hiệu hoá tài khoản: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("Không tìm thấy thông tin người dùng.");
      return;
    }

    if (!deleteReason) {
      toast.warn("Hãy chọn lý do bạn muốn xoá tài khoản 😢");
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận xoá tài khoản",
      text: "Bạn có chắc chắn muốn xoá tài khoản? Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá ngay",
      cancelButtonText: "Huỷ thao tác",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete("http://localhost:8082/PureFoods/api/users/profile/delete", { 
        data: { userId } 
      });
      if (response.data?.status === 200) {
        toast.success("Tài khoản của bạn đã được xoá. Vui lòng liên hệ admin nếu bạn muốn khôi phục lại.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error("Xoá tài khoản thất bại: " + (response.data.message || "Lỗi không xác định"));
      }
    } catch (err) {
      toast.error("Lỗi khi xoá tài khoản: " + (err.response?.data?.message || err.message));
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
        <button className="btn theme-bg-color btn-md fw-bold mt-4 text-white">
          Lưu thay đổi
        </button>
      </div>

      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Vô hiệu hoá tài khoản</h3>
        </div>
        {[
          "Tôi có mối lo ngại về quyền riêng tư",
          "Đây chỉ là tạm thời",
          "Lý do khác",
        ].map((label, index) => (
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
          Vô hiệu hoá tài khoản
        </button>
      </div>

      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Xoá tài khoản</h3>
        </div>
        {[
          "Không còn sử dụng nữa",
          "Muốn chuyển sang tài khoản khác",
          "Lý do khác",
        ].map((label, index) => (
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
          Xoá tài khoản của tôi
        </button>
      </div>
    </div>
  );
};

export default ExporterSetting;