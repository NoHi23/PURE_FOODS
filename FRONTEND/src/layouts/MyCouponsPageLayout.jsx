import { useEffect } from "react";

const MyCouponsPageLayout = ({ children }) => {
  useEffect(() => {
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


    // JS
    const jsScripts = [
      "/assets/js/jquery-3.6.0.min.js",

      "/assets/js/jquery-ui.min.js",

      "/assets/js/bootstrap/bootstrap.bundle.min.js",
      "/assets/js/bootstrap/popper.min.js",
      "/assets/js/bootstrap/bootstrap-notify.min.js",
      "/assets/js/feather/feather.min.js",
      "/assets/js/feather/feather-icon.js",

      "/assets/js/lazysizes.min.js",

      "/assets/js/table-column-remove.js",


      "/assets/js/script.js",

    ];

    const scripts = jsScripts.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return script;
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, []);

  return <>{children}</>;
};

export default MyCouponsPageLayout;