import React from "react";

const ExporterSetting = () => {
  console.log("ExporterSetting rendered");
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
        {["Hiện thông báo lên màn hình chính", "Bật thông báo", "Nhận thông báo cho các hoạt động của tôi", "Không làm phiền (DND)"].map((label, index) => (
          <div key={index} className="privacy-box">
            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
              <input className="form-check-input" type="radio" id={`option-${index}`} name="desktop" defaultChecked={index === 0} />
              <label className="form-check-label ms-2" htmlFor={`option-${index}`}>{label}</label>
            </div>
          </div>
        ))}
        <button className="btn theme-bg-color btn-md fw-bold mt-4 text-white">Lưu thay đổi</button>
      </div>
    </div>
  );
};

export default ExporterSetting;