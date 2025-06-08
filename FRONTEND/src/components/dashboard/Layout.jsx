import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <>
    <div className="tap-top">
      <span className="lnr lnr-chevron-up"></span>
    </div>
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <Header />
      <div className="page-body-wrapper">
        <Sidebar />
        <div className="page-body">
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </>
);

export default DashboardLayout;