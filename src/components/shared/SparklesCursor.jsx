import { useEffect, useRef } from 'react';

const SparklesCursor = () => {
  const containerRef = useRef(null);
  const sparkles = 50;
  const colour = "random"; // can be set to any valid colour eg "#f0f" or "red"
  
  useEffect(() => {
    let x = 400, ox = 400;
    let y = 300, oy = 300;
    let swide = 800;
    let shigh = 600;
    let sleft = 0, sdown = 0;
    
    const tiny = [];
    const star = [];
    const starv = [];
    const starx = [];
    const stary = [];
    const tinyx = [];
    const tinyy = [];
    const tinyv = [];
    
    const createDiv = (height, width) => {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.height = height + "px";
      div.style.width = width + "px";
      div.style.overflow = "hidden";
      return div;
    };
    
    const newColour = () => {
      const c = [255, Math.floor(Math.random() * 256), Math.floor(Math.random() * (256 - 255 / 2))];
      c.sort(() => 0.5 - Math.random());
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    };
    
    const set_width = () => {
      let sw_min = 999999;
      let sh_min = 999999;
      
      if (document.documentElement && document.documentElement.clientWidth) {
        if (document.documentElement.clientWidth > 0) sw_min = document.documentElement.clientWidth;
        if (document.documentElement.clientHeight > 0) sh_min = document.documentElement.clientHeight;
      }
      if (typeof(window.innerWidth) === 'number' && window.innerWidth) {
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
    
    const set_scroll = () => {
      if (typeof(window.pageYOffset) === 'number') {
        sdown = window.pageYOffset;
        sleft = window.pageXOffset;
      } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
        sdown = document.body.scrollTop;
        sleft = document.body.scrollLeft;
      } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
        sleft = document.documentElement.scrollLeft;
        sdown = document.documentElement.scrollTop;
      } else {
        sdown = 0;
        sleft = 0;
      }
    };
    
    const update_tiny = (i) => {
      if (--tinyv[i] === 25) {
        tiny[i].style.width = "1px";
        tiny[i].style.height = "1px";
      }
      if (tinyv[i]) {
        tinyy[i] += 1 + Math.random() * 3;
        tinyx[i] += (i % 5 - 2) / 5;
        if (tinyy[i] < shigh + sdown) {
          tiny[i].style.top = tinyy[i] + "px";
          tiny[i].style.left = tinyx[i] + "px";
        } else {
          tiny[i].style.visibility = "hidden";
          tinyv[i] = 0;
          return;
        }
      } else {
        tiny[i].style.visibility = "hidden";
      }
    };
    
    const update_star = (i) => {
      if (--starv[i] === 25) star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
      if (starv[i]) {
        stary[i] += 1 + Math.random() * 3;
        starx[i] += (i % 5 - 2) / 5;
        if (stary[i] < shigh + sdown) {
          star[i].style.top = stary[i] + "px";
          star[i].style.left = starx[i] + "px";
        } else {
          star[i].style.visibility = "hidden";
          starv[i] = 0;
          return;
        }
      } else {
        tinyv[i] = 50;
        tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
        tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
        tiny[i].style.width = "2px";
        tiny[i].style.height = "2px";
        tiny[i].style.backgroundColor = star[i].childNodes[0].style.backgroundColor;
        star[i].style.visibility = "hidden";
        tiny[i].style.visibility = "visible";
      }
    };
    
    const sparkle = () => {
      let c;
      if (Math.abs(x - ox) > 1 || Math.abs(y - oy) > 1) {
        ox = x;
        oy = y;
        for (c = 0; c < sparkles; c++) {
          if (!starv[c]) {
            star[c].style.left = (starx[c] = x) + "px";
            star[c].style.top = (stary[c] = y + 1) + "px";
            star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
            star[c].childNodes[0].style.backgroundColor = 
            star[c].childNodes[1].style.backgroundColor = 
              (colour === "random") ? newColour() : colour;
            star[c].style.visibility = "visible";
            starv[c] = 50;
            break;
          }
        }
      }
      for (c = 0; c < sparkles; c++) {
        if (starv[c]) update_star(c);
        if (tinyv[c]) update_tiny(c);
      }
      setTimeout(sparkle, 40);
    };
    
    const handleMouseMove = (e) => {
      y = e.pageY;
      x = e.pageX;
    };
    
    // Initialize
    set_width();
    set_scroll();
    
    if (containerRef.current) {
      for (let i = 0; i < sparkles; i++) {
        // Create tiny sparkles
        const rats = createDiv(3, 3);
        rats.style.visibility = "hidden";
        rats.style.zIndex = "9999";
        rats.style.pointerEvents = "none";
        containerRef.current.appendChild(rats);
        tiny[i] = rats;
        starv[i] = 0;
        tinyv[i] = 0;
        
        // Create star sparkles (cross shape)
        const starDiv = createDiv(5, 5);
        starDiv.style.backgroundColor = "transparent";
        starDiv.style.visibility = "hidden";
        starDiv.style.zIndex = "9999";
        starDiv.style.pointerEvents = "none";
        
        const rlef = createDiv(1, 5);
        const rdow = createDiv(5, 1);
        starDiv.appendChild(rlef);
        starDiv.appendChild(rdow);
        rlef.style.top = "2px";
        rlef.style.left = "0px";
        rdow.style.top = "0px";
        rdow.style.left = "2px";
        
        containerRef.current.appendChild(starDiv);
        star[i] = starDiv;
      }
      
      sparkle();
    }
    
    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', set_width);
    window.addEventListener('scroll', set_scroll);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', set_width);
      window.removeEventListener('scroll', set_scroll);
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
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default SparklesCursor;
