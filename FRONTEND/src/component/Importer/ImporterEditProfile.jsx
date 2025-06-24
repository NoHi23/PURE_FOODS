// ImporterEditProfile.jsx
import React from "react";

const ImporterEditProfile = () => {
  return (
    <div className="modal fade theme-modal" id="edit-profile" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel3">
              Edit Your Profile
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="row g-4">
              <div className="col-xxl-12">
                <form>
                  <div className="form-floating theme-form-floating">
                    <input type="text" className="form-control" id="pname" defaultValue="Jack Jennas" />
                    <label htmlFor="pname">Full Name</label>
                  </div>
                </form>
              </div>

              <div className="col-xxl-6">
                <form>
                  <div className="form-floating theme-form-floating">
                    <input type="email" className="form-control" id="email1" defaultValue="vicki.pope@gmail.com" />
                    <label htmlFor="email1">Email address</label>
                  </div>
                </form>
              </div>

              <div className="col-xxl-6">
                <form>
                  <div className="form-floating theme-form-floating">
                    <input
                      className="form-control"
                      type="tel"
                      defaultValue="4567891234"
                      name="mobile"
                      id="mobile"
                      maxLength="10"
                      onInput={(e) => {
                        const maxLength = 10;
                        if (e.target.value.length > maxLength) {
                          e.target.value = e.target.value.slice(0, maxLength);
                        }
                      }}
                    />
                    <label htmlFor="mobile">Số điện thoại</label>
                  </div>
                </form>
              </div>

              <div className="col-12">
                <form>
                  <div className="form-floating theme-form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="address1"
                      defaultValue="8424 James Lane South San Francisco"
                    />
                    <label htmlFor="address1">Địa chỉ</label>
                  </div>
                </form>
              </div>

              <div className="col-12">
                <form>
                  <div className="form-floating theme-form-floating">
                    <input type="text" className="form-control" id="address2" defaultValue="CA 94080" />
                    <label htmlFor="address2">Địa chỉ 2</label>
                  </div>
                </form>
              </div>

              <div className="col-xxl-4">
                <form>
                  <div className="form-floating theme-form-floating">
                    <select className="form-select" id="floatingSelect1" defaultValue="">
                      <option value="" disabled>
                        Chọn Tỉnh/Thành phố
                      </option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="tphcm">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="haiphong">Hải Phòng</option>
                      <option value="cantho">Cần Thơ</option>
                      <option value="hue">Huế</option>
                      <option value="nhatrang">Nha Trang</option>
                      <option value="dalat">Đà Lạt</option>
                      <option value="vungtau">Vũng Tàu</option>
                      <option value="quangninh">Quảng Ninh</option>
                      <option value="nghean">Nghệ An</option>
                      <option value="thanhhoa">Thanh Hóa</option>
                      <option value="binhduong">Bình Dương</option>
                      <option value="dongnai">Đồng Nai</option>
                      <option value="longan">Long An</option>
                      <option value="khanhhoa">Khánh Hòa</option>
                      <option value="lamdong">Lâm Đồng</option>
                      <option value="tayninh">Tây Ninh</option>
                    </select>
                    <label htmlFor="floatingSelect1">Tỉnh/Thành phố</label>
                  </div>
                </form>
              </div>

              <div className="col-xxl-4">
                <form>
                  <div className="form-floating theme-form-floating">
                    <select className="form-select" id="floatingSelect" defaultValue="">
                      <option value="">Choose Your City</option>
                      <option value="kingdom">India</option>
                      <option value="states">Canada</option>
                      <option value="fra">Dubai</option>
                      <option value="china">Los Angeles</option>
                      <option value="spain">Thailand</option>
                    </select>
                    <label htmlFor="floatingSelect">City</label>
                  </div>
                </form>
              </div>

              <div className="col-xxl-4">
                <form>
                  <div className="form-floating theme-form-floating">
                    <input type="text" className="form-control" id="address3" defaultValue="94080" />
                    <label htmlFor="address3">Pin Code</label>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" data-bs-dismiss="modal" className="btn theme-bg-color btn-md fw-bold text-light">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImporterEditProfile;
