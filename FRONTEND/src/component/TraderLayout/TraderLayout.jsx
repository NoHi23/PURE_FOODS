import { useEffect } from "react";

const TraderLayout = ({ children }) => {
  useEffect(() => {
    const cssLinks = [
      {
        href: "https://fonts.googleapis.com/css2?family=Russo+One&display=swap",
        id: "font-russo",
      },
      {
        href: "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap",
        id: "font-exo",
      },
      {
        href: "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        id: "font-public",
      },
      { href: "/assets/css/vendors/bootstrap.css", id: "bootstrap-css" },
      { href: "/assets/css/bulk-style.css", id: "bulk-style-css" },
      { href: "/assets/css/style.css", id: "main-style-css" },
    ];

    const jsScripts = [
      { src: "/assets/js/jquery-ui.min.js", id: "jquery-ui" },
      { src: "/assets/js/bootstrap/bootstrap.bundle.min.js", id: "bootstrap-bundle" },
      { src: "/assets/js/feather/feather.min.js", id: "feather" },
      { src: "/assets/js/feather/feather-icon.js", id: "feather-icon" },
      { src: "/assets/js/lazysizes.min.js", id: "lazysizes" },
    ];

    const addedLinks = [];
    const addedScripts = [];

    // Thêm CSS
    cssLinks.forEach(({ href, id }) => {
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.id = id;
        document.head.appendChild(link);
        addedLinks.push(link);
      }
    });

    // Thêm JS
    jsScripts.forEach(({ src, id }) => {
      if (!document.getElementById(id)) {
        const script = document.createElement("script");
        script.src = src;
        script.defer = true;
        script.id = id;
        document.body.appendChild(script);
        addedScripts.push(script);
      }
    });

    // Cleanup khi unmount
    return () => {
      addedLinks.forEach((link) => {
        if (link && link.parentNode) link.parentNode.removeChild(link);
      });
      addedScripts.forEach((script) => {
        if (script && script.parentNode) script.parentNode.removeChild(script);
      });
    };
  }, []);

  return <>{children}</>;
};

export default TraderLayout;
