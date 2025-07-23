import { useEffect } from "react";

const WishListLayout = ({ children }) => {
  useEffect(() => {
    // CSS
    const headLinks = [
      "https://fonts.gstatic.com",
      "https://fonts.googleapis.com/css2?family=Russo+One&display=swap",
      "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
      "/assets/css/vendors/bootstrap.css",
      "/assets/css/bulk-style.css",
      "/assets/css/style.css",
    ];

    const links = headLinks.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    // Scripts cần load theo thứ tự
    const jsScripts = [
      "/assets/js/jquery-3.6.0.min.js",
      "/assets/js/jquery-ui.min.js",
      "/assets/js/bootstrap/bootstrap.bundle.min.js",
      "/assets/js/bootstrap/bootstrap-notify.min.js",
      "/assets/js/bootstrap/popper.min.js",
      "/assets/js/feather/feather.min.js",
      "/assets/js/feather/feather-icon.js",
      "/assets/js/lazysizes.min.js",
      "/assets/js/script.js",
    ];

    // Load script tuần tự để tránh lỗi phụ thuộc
    const loadedScripts = [];

    const loadScriptSequentially = (index) => {
      if (index >= jsScripts.length) return;
      const script = document.createElement("script");
      script.src = jsScripts[index];
      script.async = false;
      script.onload = () => loadScriptSequentially(index + 1);
      document.body.appendChild(script);
      loadedScripts.push(script);
    };

    loadScriptSequentially(0);

    // Cleanup khi unmount
    return () => {
      links.forEach((link) => document.head.removeChild(link));
      loadedScripts.forEach((script) => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  return <>{children}</>;
};

export default WishListLayout;
