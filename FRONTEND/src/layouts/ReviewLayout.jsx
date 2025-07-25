import React, { useEffect } from "react";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";

const headLinks = [
  "https://fonts.gstatic.com",
  "https://fonts.googleapis.com/css2?family=Russo+One&display=swap",
  "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap",
  "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  "/assets/css/vendors/bootstrap.css",
  "/assets/css/animate.min.css",
  "/assets/css/bulk-style.css",
  "/assets/css/style.css",
];

const jsScripts = [
  "/assets/js/jquery-3.6.0.min.js",
  "/assets/js/jquery-ui.min.js",
  "/assets/js/bootstrap/bootstrap.bundle.min.js",
  "/assets/js/bootstrap/popper.min.js",
  "/assets/js/feather/feather.min.js",
  "/assets/js/feather/feather-icon.js",
  "/assets/js/lazysizes.min.js",
  "/assets/js/quantity-2.js",
  "/assets/js/jquery.elevatezoom.js",
  "/assets/js/sticky-cart-bottom.js",
  "/assets/js/timer1.js",
  "/assets/js/wow.min.js",
  "/assets/js/custom-wow.js",
];

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const ReviewLayout = ({ children }) => {
  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Load CSS
        headLinks.forEach((href) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          document.head.appendChild(link);
        });

        // Load JS
        for (const src of jsScripts) {
          await loadScript(src);
        }

        console.log("Review layout assets loaded.");
      } catch (err) {
        console.error("Failed to load review layout assets:", err);
      }
    };

    loadAssets();

    return () => {
      // Cleanup CSS
      document.querySelectorAll("link").forEach((link) => {
        if (headLinks.includes(link.href.replace(window.location.origin, ""))) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <TopBar />
      <div className="page-body-wrapper">
        <SideBar />
        <div className="page-body">
          <div className="container">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewLayout;
