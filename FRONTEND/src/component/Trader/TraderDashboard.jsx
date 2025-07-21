import React, { useState } from "react";
import TraderLayout from "../TraderLayout/TraderLayout";
import TraderTab from "./TraderTab";
import TraderProductMapping from "./TraderProductMapping";
import TraderImportRequests from "./TraderImportRequests";
import TraderReturnRequests from "./TraderReturnRequests";
import TraderInventoryCreate from "./TraderInventoryCreate";
import TraderReport from "./TraderReport";
import TraderProfile from "./TraderProfile";

const TraderDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [inventoryRefreshKey, setInventoryRefreshKey] = useState(Date.now());

  const reloadInventory = () => {
    setInventoryRefreshKey(Date.now());
  };

  return (
    <TraderLayout>
      <section className="user-dashboard-section section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            {/* Sidebar trái với các tab */}
            <TraderTab user={user} />

            {/* Nội dung tab */}
            <div className="col-xxl-9 col-lg-8">
              <div className="dashboard-right-sidebar">
                <div className="tab-content" id="trader-tabContent">
                  {/* Ánh xạ sản phẩm */}
                  <div className="tab-pane fade" id="trader-product-mapping" role="tabpanel">
                    <TraderProductMapping
                      traderId={user.userId}
                      onInventoryChange={reloadInventory}
                      key={inventoryRefreshKey}
                    />
                  </div>
                 

                  {/* Tồn kho */}
                  <div className="tab-pane fade" id="trader-inventory" role="tabpanel">
                    <TraderInventoryCreate traderId={user.userId} onInventoryChange={reloadInventory} />
                    
                  </div>

                  {/* Yêu cầu nhập hàng */}
                  <div className="tab-pane fade" id="trader-import" role="tabpanel">
                    <TraderImportRequests traderId={user.userId}
                    onInventoryChange={reloadInventory}
                     />
                      
                  </div>

                  {/* Trả hàng */}
                  <div className="tab-pane fade" id="trader-returns" role="tabpanel">
                    <TraderReturnRequests traderId={user.userId} />
                  </div>

                  {/* Báo cáo */}
                  <div className="tab-pane fade" id="trader-reports" role="tabpanel">
                    <TraderReport traderId={user.userId} />
                  </div>

                  {/* Hồ sơ cá nhân */}
                  <div className="tab-pane fade" id="trader-profile" role="tabpanel">
                    <TraderProfile user={user} />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </TraderLayout>
  );
};

export default TraderDashboard;
