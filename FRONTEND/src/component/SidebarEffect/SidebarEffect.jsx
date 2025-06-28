import { useEffect } from "react";

const SidebarEffect = () => {
  useEffect(() => {
    // Tạo canvas và context
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;                     // tránh crash nếu context không lấy được

    // Biến trạng thái
    let width  = window.innerWidth;
    let height = window.innerHeight;
    const nodes = [];
    let bgGradient, overlayGradient;
    let rafId;                            // requestAnimationFrame ID

    // Lớp hạt
    class Node {
      constructor(x, y, radius, blur, baseSpeed = 1) {
        this.x      = x;
        this.y      = y;
        this.radius = radius;
        this.blur   = blur;
        this.a      = Math.random() * Math.PI * 2;
        this.speed  = Math.random() * baseSpeed + baseSpeed / 2;
      }
    }

    // Khởi tạo hạt
    const initNodes = (count = 100) => {
      nodes.length = 0;
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 32 + 32;
        const blur   = Math.random() * 0.3 + 0.7;
        const x      = Math.random() * width;
        const y      = Math.random() * height;
        nodes.push(new Node(x, y, radius, blur));
      }
    };

    // Tính lại kích thước & gradient khi resize
    const resize = () => {
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas.width  = width;
      canvas.height = height;

      const cx = width / 2;
      const cy = height / 2;

      bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
      bgGradient.addColorStop(0, "#666");
      bgGradient.addColorStop(1, "#000");

      overlayGradient = ctx.createLinearGradient(0, height, width, 0);
      overlayGradient.addColorStop(0.25, "teal");
      overlayGradient.addColorStop(0.75, "orange");
    };

    // Vòng render
    const draw = () => {
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      for (const n of nodes) {
        const dx = Math.cos(n.a) * n.speed;
        const dy = Math.sin(n.a) * n.speed;
        n.x += dx;
        n.y += dy;

        if (n.x < -n.radius * 2 && dx < 0)           n.x = width + n.radius * 2;
        else if (n.x > width + n.radius && dx > 0)   n.x = -n.radius;

        if (n.y < -n.radius && dy < 0)               n.y = height + n.radius * 2;
        else if (n.y > height + n.radius && dy > 0)  n.y = -n.radius;

        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.radius);
        g.addColorStop(0,           "rgba(255,255,255,0.5)");
        g.addColorStop(n.blur,      "rgba(255,255,255,0.5)");
        g.addColorStop(1,           "rgba(255,255,255,0)");
        ctx.fillStyle = g;

        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.beginPath();
        ctx.arc(0, 0, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };

    // Gắn canvas vào DOM
    const container = document.getElementById("sidebarEffect");
    container?.appendChild(canvas);

    // Khởi tạo
    resize();
    initNodes();
    loop();
    window.addEventListener("resize", resize);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      container?.removeChild(canvas);
    };
  }, []);

  return null; // component không render gì, chỉ side-effect
};

export default SidebarEffect;
