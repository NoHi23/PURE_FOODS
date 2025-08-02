import { useEffect } from "react";
import { toast } from "react-toastify";

const ExporterLayout = ({ children }) => {
  useEffect(() => {
    const cssLinks = [
      "https://fonts.googleapis.com/css2?family=Russo+One&display=swap",
      "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
      "/assets/css/vendors/bootstrap.css",
      "/assets/css/bulk-style.css",
      "/assets/css/style.css",
    ];

    const scriptPaths = [
      "/assets/js/jquery-ui.min.js",
      "/assets/js/bootstrap/bootstrap.bundle.min.js",
      "/assets/js/bootstrap/bootstrap-notify.min.js",
      "/assets/js/bootstrap/popper.min.js",
      // Loại bỏ feather scripts vì dùng react-feather component: không cần "/assets/js/feather.min.js", "/assets/js/feather-icon.js"
      "/assets/js/lazysizes.min.js",
      "/assets/js/ion.rangeSlider.min.js",
    ];

    const loadedResources = new Set();

    const linkElements = cssLinks
      .map((href) => {
        if (!loadedResources.has(href)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.onload = () => console.log(`CSS loaded: ${href}`);
          link.onerror = () => {
            console.error(`Failed to load CSS: ${href}`);
            toast.error(`Không thể tải tài nguyên CSS: ${href}`);
          };
          document.head.appendChild(link);
          loadedResources.add(href);
          return link;
        }
        return null;
      })
      .filter((link) => link !== null);

    const scriptElements = scriptPaths
      .map((src) => {
        if (!loadedResources.has(src)) {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => {
            console.log(`JS loaded: ${src}`);
          };
          script.onerror = () => {
            console.error(`Failed to load JS: ${src}`);
            toast.error(`Không thể tải tài nguyên JS: ${src}`);
          };
          document.body.appendChild(script);
          loadedResources.add(src);
          return script;
        }
        return null;
      })
      .filter((script) => script !== null);

    return () => {
      linkElements.forEach((link) => document.head.removeChild(link));
      scriptElements.forEach((script) => document.body.removeChild(script));
    };
  }, []);

  return (
    <div className="exporter-layout" style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f8f9fa" }}>
      {children}
    </div>
  );
};

export default ExporterLayout;