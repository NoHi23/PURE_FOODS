import { useEffect } from "react";

const HomepageLayout = ({ children }) => {
  useEffect(() => {
    const headLinks = [
        "https://fonts.googleapis.com/css2?family=Russo+One&display=swap",
      "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
      "https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap",
      "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
      "/assets/css/vendors/bootstrap.css",
      "/assets/css/animate.min.css",
      "/assets/css/bulk-style.css",
      "/assets/css/vendors/animate.css",
      "/assets/css/style.css"
    ];

    const links = headLinks.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, []);

  return <>{children}</>;
};

export default HomepageLayout;
