import { useEffect, useRef } from 'react';

const ShootingStar = () => {
  const containerRef = useRef(null);
  const cometsRef = useRef([]);
  const animationRef = useRef([]);

  useEffect(() => {
    const speed = 25;
    const how_often = 20; // increased from 10 to make them appear less frequently
    const how_many = 4; // reduced from 10 to have fewer comets
    const colours = ["#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#fcd34d", "#fde68a"];
    
    let dx = [];
    let dy = [];
    let xpos = [];
    let ypos = [];
    let comets = [];
    let swide = 800;
    let shigh = 600;
    const tail = colours.length;

    const setWidth = () => {
      let sw_min = 999999;
      let sh_min = 999999;
      
      if (document.documentElement && document.documentElement.clientWidth) {
        if (document.documentElement.clientWidth > 0) sw_min = document.documentElement.clientWidth;
        if (document.documentElement.clientHeight > 0) sh_min = document.documentElement.clientHeight;
      }
      if (typeof(window.innerWidth) !== "undefined" && window.innerWidth) {
        if (window.innerWidth > 0 && window.innerWidth < sw_min) sw_min = window.innerWidth;
        if (window.innerHeight > 0 && window.innerHeight < sh_min) sh_min = window.innerHeight;
      }
      if (document.body.clientWidth) {
        if (document.body.clientWidth > 0 && document.body.clientWidth < sw_min) sw_min = document.body.clientWidth;
        if (document.body.clientHeight > 0 && document.body.clientHeight < sh_min) sh_min = document.body.clientHeight;
      }
      if (sw_min === 999999 || sh_min === 999999) {
        sw_min = 800;
        sh_min = 600;
      }
      swide = sw_min;
      shigh = sh_min;
    };

    const stepthrough = (a) => {
      let i;
      // Check if comet has gone off screen
      if (ypos[a] + dy[a] < -50 || xpos[a] + dx[a] < -50 || 
          xpos[a] + dx[a] >= swide + 50 || ypos[a] + dy[a] >= shigh + 50) {
        // Hide all tail segments
        for (i = 0; i < tail; i++) {
          if (comets[i + a]) comets[i + a].style.visibility = "hidden";
        }
        // Launch new comet after delay
        setTimeout(() => launch(a), Math.max(1000, 2000 * Math.random() * how_often));
      } else {
        // Continue moving
        setTimeout(() => stepthrough(a), speed);
        
        // Update positions
        for (i = tail - 1; i >= 0; i--) {
          if (i) {
            xpos[i + a] = xpos[i + a - 1];
            ypos[i + a] = ypos[i + a - 1];
          } else {
            xpos[i + a] += dx[a];
            ypos[i + a] += dy[a];
          }
          if (comets[i + a]) {
            comets[i + a].style.left = xpos[i + a] + "px";
            comets[i + a].style.top = ypos[i + a] + "px";
          }
        }
      }
    };

    const launch = (a) => {
      let i;
      dx[a] = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 3);
      dy[a] = (Math.random() > 0.5 ? 1 : -1) * ((7 - dx[a]) / 3 + Math.random() * (dx[a] + 5) / 3);
      xpos[a] = 2 * tail * dx[a] + Math.round(Math.random() * (swide - 4 * tail * dx[a]));
      ypos[a] = 2 * tail * dy[a] + Math.round(Math.random() * (shigh - 4 * tail * dy[a]));
      
      for (i = 0; i < tail; i++) {
        xpos[i + a] = xpos[a];
        ypos[i + a] = ypos[a];
        if (comets[i + a]) comets[i + a].style.visibility = "visible";
      }
      stepthrough(a);
    };

    const writeComet = (a) => {
      let i, s;
      for (i = 0; i < tail; i++) {
        s = 2 + (i < tail / 4 ? 1 : 0) + (i === 0 ? 2 : 0);
        const d = document.createElement("div");
        d.style.position = "absolute";
        d.style.overflow = "hidden";
        d.style.width = s + "px";
        d.style.height = s + "px";
        d.style.backgroundColor = colours[i];
        d.style.borderRadius = "50%";
        comets[i + a] = d;
        if (containerRef.current) {
          containerRef.current.appendChild(comets[i + a]);
        }
      }
    };

    // Initialize
    setWidth();
    cometsRef.current = comets;

    if (containerRef.current) {
      for (let i = 0; i < how_many; i++) {
        writeComet(i * tail);
        setTimeout(() => launch(i * tail), Math.max(1000 * i));
      }
    }

    // Handle resize
    const handleResize = () => setWidth();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      animationRef.current.forEach(timeout => clearTimeout(timeout));
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '1px',
        height: '1px',
        overflow: 'visible',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default ShootingStar;
