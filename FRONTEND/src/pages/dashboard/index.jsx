import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import Footer from "../../components/dashboard/footer";

const Dashboard = () => {
  return (
    <>
      {/* Nút scroll lên top */}
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>
      {/* Wrapper tổng */}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        {/* Header */}
        <Header />
        {/* Body wrapper */}
        <div className="page-body-wrapper">
          {/* Sidebar bên trái */}
          <Sidebar />
          {/* Nội dung chính */}
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                {/* Ví dụ: Card thống kê */}
                <div className="col-sm-6 col-xxl-3 col-lg-6">
                  <div className="main-tiles border-5 border-0 card-hover card o-hidden">
                    <div className="custome-1-bg b-r-4 card-body">
                      <div className="media align-items-center static-top-widget">
                        <div className="media-body p-0">
                          <span className="m-0">Tổng số đơn hàng</span>
                          <h4 className="mb-0 counter">120</h4>
                        </div>
                        <div className="align-self-center text-center">
                          <i className="ri-shopping-bag-3-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Thêm các card hoặc nội dung khác tại đây */}
              </div>
              {/* Thêm các section khác nếu cần */}
            </div>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;