// ImporterSetting.jsx
import React from "react";

const ImporterSetting = () => {
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

      {/* Phần thông báo */}
      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Thông báo</h3>
        </div>
        {["Hiện thông báo lên màn hình chính", "Bật thông báo", "Nhận thông báo cho các hoạt động của tôi", "Không làm phiền (DND)"].map((label, index) => (
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

      {/* Phần vô hiệu hóa */}
      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Vô hiệu hoá tài khoản</h3>
        </div>
        {["Tôi có mối lo ngại về quyền riêng tư", "Đây chỉ là tạm thời", "Lý do khác"].map((label, index) => (
          <div key={index} className="privacy-box">
            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
              <input className="form-check-input" type="radio" id={`disable-${index}`} name="concern" />
              <label className="form-check-label ms-2" htmlFor={`disable-${index}`}>
                {label}
              </label>
            </div>
          </div>
        ))}
        <button style={{ backgroundColor: "#FFE57F" }} className="btn btn-md fw-bold mt-4 text-black">
          Vô hiệu hoá tài khoản
        </button>
      </div>

      {/* Phần xoá tài khoản */}
      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Xoá tài khoản</h3>
        </div>
        {["Không còn sử dụng nữa", "Muốn chuyển sang tài khoản khác", "Lý do khác"].map((label, index) => (
          <div key={index} className="privacy-box">
            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
              <input className="form-check-input" type="radio" id={`delete-${index}`} name="usable" />
              <label className="form-check-label ms-2" htmlFor={`delete-${index}`}>
                {label}
              </label>
            </div>
          </div>
        ))}
        <button style={{ backgroundColor: "red" }} className="btn btn-md fw-bold mt-4 text-white">
          Xoá tài khoản của tôi
        </button>
      </div>
    </div>
  );
};

export default ImporterSetting;
