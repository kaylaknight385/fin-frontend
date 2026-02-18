import { useEffect, useRef } from 'react';

const BlockRain = () => {
  const containerRef = useRef(null);
  const blocksRef = useRef([]);
  const animationRef = useRef([]);

  useEffect(() => {
    const colour = "#cc99ff";
    const border = "#6600ff";
    const speed = 40;
    const size = 20;
    const drops = 40;
    
    let swide, shigh;
    const blox = [];
    const blok = [];

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

    const subblock = (r) => {
      if (--blox[r] > -1) {
        if (blok[r]) {
          blok[r].style.opacity = blox[r] / 10;
          animationRef.current[r] = setTimeout(() => subblock(r), speed * drops / 12);
        }
      } else if (blok[r]) {
        blok[r].style.visibility = "hidden";
      }
    };

    const mainblock = (r) => {
      const t = 4 + size * Math.floor(Math.random() * (shigh - size) / size);
      const l = 4 + size * Math.floor(Math.random() * (swide - size) / size);
      
      if (blok[r]) {
        blok[r].style.left = l + "px";
        blok[r].style.top = t + "px";
        blox[r] = 11;
        blok[r].style.visibility = "visible";
        subblock(r);
      }
      
      animationRef.current[r] = setTimeout(() => mainblock((r + 1) % drops), speed);
    };

    // Initialize
    setWidth();
    
    if (containerRef.current) {
      // Create blocks
      for (let i = 0; i < drops; i++) {
        const d = document.createElement("div");
        d.style.width = size + "px";
        d.style.height = size + "px";
        d.style.overflow = "hidden";
        d.style.position = "absolute";
        d.style.visibility = "hidden";
        d.style.backgroundColor = colour;
        d.style.border = "1px solid " + border;
        blox[i] = -1;
        blok[i] = d;
        containerRef.current.appendChild(d);
      }
      
      blocksRef.current = blok;
      
      // Start animation
      mainblock(0);
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

export default BlockRain;
