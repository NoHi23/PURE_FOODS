import { useEffect } from "react";

const SidebarEffect = () => {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let nodes = [];
    let bgGradient, overlayGradient;
    let animationFrameId;

    function Node(x, y, radius, blur, speed) {
      speed /= 2;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.blur = blur;
      this.a = Math.random() * Math.PI * 2;
      this.speed = Math.random() * speed + speed;
    }

    function redraw() {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      const cx = width / 2;
      const cy = height / 2;

      bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
      bgGradient.addColorStop(0, "#666");
      bgGradient.addColorStop(1, "#000");

      overlayGradient = ctx.createLinearGradient(0, height, width, 0);
      overlayGradient.addColorStop(0.25, "teal");
      overlayGradient.addColorStop(0.75, "orange");
    }

    function render() {
      animationFrameId = requestAnimationFrame(render);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      for (let node of nodes) {
        let dx = Math.cos(node.a) * node.speed;
        let dy = Math.sin(node.a) * node.speed;

        node.x += dx;
        node.y += dy;

        if (node.x < -node.radius * 2 && dx < 0) {
          node.x = width + node.radius * 2;
        } else if (node.x > width + node.radius && dx > 0) {
          node.x = -node.radius;
        }

        if (node.y < -node.radius && dy < 0) {
          node.y = height + node.radius * 2;
        } else if (node.y > height + node.radius && dy > 0) {
          node.y = -node.radius;
        }

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, node.radius);
        gradient.addColorStop(0, "rgba(255,255,255,0.5)");
        gradient.addColorStop(node.blur, "rgba(255,255,255,0.5)");
        gradient.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.fillStyle = gradient;
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.beginPath();
        ctx.arc(0, 0, node.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    for (let i = 0; i < 100; i++) {
      const radius = Math.random() * 32 + 32;
      const blur = Math.random() * 0.3 + 0.7;
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push(new Node(x, y, radius, blur, 1));
    }

    const container = document.getElementById("sidebarEffect");
    if (container) {
      container.appendChild(canvas);
    }

    window.addEventListener("resize", redraw);
    redraw();
    render();

    return () => {
      window.removeEventListener("resize", redraw);
      cancelAnimationFrame(animationFrameId);
      if (container && canvas) container.removeChild(canvas);
    };
  }, []);

  return null;
};

export default SidebarEffect;
