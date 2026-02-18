import { useEffect, useRef } from 'react';

const LoveHeartCursor = () => {
  const containerRef = useRef(null);
  const heartsRef = useRef([]);

  useEffect(() => {
    const colours = ['plum', 'pink', 'white', 'coral', 'bisque'];
    const minisize = 12;
    const maxisize = 15;
    const stars = 66;
    const over_or_under = "over";
    
    let x = 400, ox = 400;
    let y = 300, oy = 300;
    let swide = 800;
    let shigh = 600;
    let sleft = 0, sdown = 0;
    
    const herz = [];
    const herzx = [];
    const herzy = [];
    const herzs = [];
    let kiss = false;

    const setWidth = () => {
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

    const setScroll = () => {
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

    const breakMyHeart = (i) => {
      herz[i].textContent = '✿';
      herz[i].style.fontWeight = 'bold';
      herzy[i] = false;
      
      let t;
      for (t = herzs[i]; t <= maxisize; t++) {
        setTimeout(() => {
          if (herz[i]) herz[i].style.fontSize = t + 'px';
        }, 60 * (t - herzs[i]));
      }
      setTimeout(() => {
        if (herz[i]) herz[i].style.visibility = 'hidden';
      }, 60 * (t - herzs[i]));
    };

    const blowMeAKiss = (i) => {
      herzy[i] -= herzs[i] / minisize + i % 2;
      herzx[i] += (i % 5 - 2) / 5;
      
      if (herzy[i] < sdown - herzs[i] || herzx[i] < sleft - herzs[i] || herzx[i] > sleft + swide - herzs[i]) {
        herz[i].style.visibility = 'hidden';
        herzy[i] = false;
      } else if (herzs[i] > minisize + 2 && Math.random() < 0.5 / stars) {
        breakMyHeart(i);
      } else {
        if (Math.random() < maxisize / herzy[i] && herzs[i] < maxisize) {
          herzs[i]++;
          herz[i].style.fontSize = herzs[i] + 'px';
        }
        herz[i].style.top = herzy[i] + 'px';
        herz[i].style.left = herzx[i] + 'px';
      }
    };

    const herzle = () => {
      let c;
      if (Math.abs(x - ox) > 1 || Math.abs(y - oy) > 1) {
        ox = x;
        oy = y;
        for (c = 0; c < stars; c++) {
          if (herzy[c] === false) {
            herz[c].textContent = '🌸';
            herz[c].style.left = (herzx[c] = x - minisize / 2) + 'px';
            herz[c].style.top = (herzy[c] = y - minisize) + 'px';
            herz[c].style.fontSize = minisize + 'px';
            herz[c].style.fontWeight = 'normal';
            herz[c].style.visibility = 'visible';
            herzs[c] = minisize;
            break;
          }
        }
      }
      
      for (c = 0; c < stars; c++) {
        if (herzy[c] !== false) blowMeAKiss(c);
      }
      
      setTimeout(herzle, 40);
    };

    const pucker = () => {
      ox = -1;
      oy = -1;
      kiss = setTimeout(pucker, 100);
    };

    const handleMouseMove = (e) => {
      y = e.pageY;
      x = e.pageX;
    };

    const handleMouseDown = () => {
      pucker();
    };

    const handleMouseUp = () => {
      clearTimeout(kiss);
    };

    // Initialize
    setWidth();
    setScroll();

    if (containerRef.current) {
      for (let i = 0; i < stars; i++) {
        const heart = document.createElement('div');
        heart.style.position = 'absolute';
        heart.style.height = 'auto';
        heart.style.width = 'auto';
        heart.style.overflow = 'hidden';
        heart.style.backgroundColor = 'transparent';
        heart.style.visibility = 'hidden';
        heart.style.zIndex = over_or_under === 'over' ? '9999' : '0';
        heart.style.color = colours[i % colours.length];
        heart.style.pointerEvents = 'none';
        heart.style.opacity = '0.75';
        heart.textContent = '🌸';
        
        containerRef.current.appendChild(heart);
        herz[i] = heart;
        herzy[i] = false;
      }
      
      heartsRef.current = herz;
      herzle();
    }

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', setWidth);
    window.addEventListener('scroll', setScroll);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', setWidth);
      window.removeEventListener('scroll', setScroll);
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

export default LoveHeartCursor;
