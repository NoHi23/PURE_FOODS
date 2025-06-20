import { useEffect } from "react";

const ImporterLayout = ({ children }) => {
  useEffect(() => {
    // Danh sách file CSS
    const cssLinks = [
      // Google Fonts
      "https://fonts.googleapis.com/css2?family=Russo+One&display=swap",
      "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",

      // Local styles
      "/assets/css/vendors/bootstrap.css",
      "/assets/css/bulk-style.css",
      "/assets/css/style.css",
    ];

    // Danh sách file JS
    const scriptPaths = [
      "/assets/js/jquery-3.6.0.min.js",
      "/assets/js/jquery-ui.min.js",
      "/assets/js/bootstrap/bootstrap.bundle.min.js",
      "/assets/js/bootstrap/bootstrap-notify.min.js",
      "/assets/js/bootstrap/popper.min.js",
      "/assets/js/feather/feather.min.js",
      "/assets/js/feather/feather-icon.js",
      "/assets/js/lazysizes.min.js",
      "/assets/js/slick/slick.js",
      "/assets/js/slick/custom_slick.js",
      "/assets/js/apexchart.js",
      "/assets/js/custom-chart.js",
      "/assets/js/nav-tab.js",
      "/assets/js/script.js",
      "/assets/js/theme-setting.js",
    ];

    // Gắn link CSS
    const linkElements = cssLinks.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    // Gắn script JS
    const scriptElements = scriptPaths.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false; // Đảm bảo thứ tự load
      document.body.appendChild(script);
      return script;
    });

    // Cleanup khi unmount component
    return () => {
      linkElements.forEach((link) => document.head.removeChild(link));
      scriptElements.forEach((script) => document.body.removeChild(script));
    };
  }, []);


  return <>{children}</>;
};

export default ImporterLayout;
