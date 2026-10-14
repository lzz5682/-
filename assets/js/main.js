/* ============================================================
   黑流树海 · 交互脚本
   1) 孢子浮尘粒子  2) 滚动显现  3) 导航状态  4) 光标微光
   ============================================================ */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 孢子浮尘 ---------- */
  const canvas = document.getElementById('spores');

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d', { alpha: true });

    // 预渲染一颗发光粒子，避免每帧 createRadialGradient 造成卡顿
    const SPRITE = 64;
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = SPRITE;
    {
      const sc = sprite.getContext('2d');
      const g = sc.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
      g.addColorStop(0,    'rgba(255,255,255,1)');
      g.addColorStop(0.18, 'rgba(255,255,255,.85)');
      g.addColorStop(0.45, 'rgba(255,255,255,.22)');
      g.addColorStop(1,    'rgba(255,255,255,0)');
      sc.fillStyle = g;
      sc.fillRect(0, 0, SPRITE, SPRITE);
    }

    // 两种粒子：青绿孢子 / 橙黄火星
    const TINTS = {
      spore: [ [127, 200, 178], [47, 122, 104], [110, 170, 190] ],
      ember: [ [240, 168, 60], [232, 205, 148], [201, 168, 106] ]
    };

    let W = 0, H = 0, dpr = 1;
    let particles = [];
    let running = true;
    let drift = 0;

    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = arr => arr[(Math.random() * arr.length) | 0];

    function makeParticle(seedY) {
      const isEmber = Math.random() < 0.16;
      const kind = isEmber ? 'ember' : 'spore';
      const tint = pick(TINTS[kind]);
      return {
        x: Math.random() * W,
        y: seedY ? Math.random() * H : H + rand(0, 120),
        r: isEmber ? rand(0.8, 2.6) : rand(0.5, 2.0),
        vx: rand(-0.16, 0.16),
        vy: isEmber ? rand(-0.30, -0.10) : rand(-0.22, -0.05),
        a: isEmber ? rand(0.25, 0.6) : rand(0.06, 0.24),
        twinkle: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.004, 0.016),
        tint
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 粒子数量随屏幕面积自适应，移动端更少
      const density = W < 760 ? 9000 : 5600;
      const count = Math.max(28, Math.min(220, Math.round((W * H) / density)));
      particles = Array.from({ length: count }, () => makeParticle(true));
    }

    // 为每种色调预生成一张着色 sprite，避免每帧重新着色
    const tintedSprites = new Map();
    function tinted(key) {
      if (tintedSprites.has(key)) return tintedSprites.get(key);
      const [r, g, b] = key.split(',').map(Number);
      const c = document.createElement('canvas');
      c.width = c.height = SPRITE;
      const cc = c.getContext('2d');
      cc.drawImage(sprite, 0, 0);
      cc.globalCompositeOperation = 'source-in';
      cc.fillStyle = `rgb(${r},${g},${b})`;
      cc.fillRect(0, 0, SPRITE, SPRITE);
      tintedSprites.set(key, c);
      return c;
    }

    function frameTinted() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      drift += 0.0018;
      ctx.globalCompositeOperation = 'lighter';

      for (const p of particles) {
        p.x += p.vx + Math.sin(drift + p.twinkle) * 0.09;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        if (p.y < -30 || p.x < -40 || p.x > W + 40) {
          const fresh = makeParticle(false);
          const keepX = Math.random() * W;
          Object.assign(p, fresh, { x: keepX });
        }

        const alpha = p.a * (0.62 + 0.38 * Math.sin(p.twinkle));
        const size = p.r * 9;
        const key = p.tint.join(',');
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.drawImage(tinted(key), p.x - size / 2, p.y - size / 2, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(frameTinted);
    }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(frameTinted);
    });

    resize();
    requestAnimationFrame(frameTinted);
  }

  /* ---------- 2. 滚动显现 ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('revealed'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));
  }

  // 技能条需要父级带 .revealed 才触发动画
  const skills = document.querySelector('.skills');
  if (skills) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      skills.classList.add('revealed');
    } else {
      const sio = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        });
      }, { threshold: 0.25 });
      sio.observe(skills);
    }
  }

  /* ---------- 3. 导航 ---------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (nav) nav.classList.toggle('solid', window.scrollY > 40);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', e => {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // 当前所在区块高亮
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s));
  }

  /* ---------- 4. 光标微光（仅精确指针设备） ---------- */
  const glow = document.getElementById('cursorGlow');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (glow && finePointer && !reduceMotion) {
    let tx = window.innerWidth / 2, ty = window.innerHeight / 3;
    let cx = tx, cy = ty;

    window.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    (function follow() {
      cx += (tx - cx) * 0.075;
      cy += (ty - cy) * 0.075;
      glow.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- 5. 其它 ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // 占位链接（href="#"）点击时不跳动
  document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener('click', e => e.preventDefault());
  });
})();
