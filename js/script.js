/* ==========================================================
   script.js — ハル｜コーダー Portfolio
   処理:
   01. 花びらパーティクル (Canvas)
   02. Header スクロールで影を追加
   03. ハンバーガーメニュー 開閉
   04. スクロールアニメーション (Intersection Observer)
   05. スムーズスクロール
========================================================== */

/* ----------------------------------------------------------
   01. 花びらパーティクル (Canvas)
---------------------------------------------------------- */
const canvas = document.getElementById('petal-canvas');
const ctx    = canvas.getContext('2d');

// キャンバスをウィンドウサイズに合わせる
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 花びら1粒のクラス
function Petal() {
  this.reset();
}
Petal.prototype.reset = function () {
  this.x   = Math.random() * canvas.width;
  this.y   = -10;
  this.r   = Math.random() * 3 + 2;
  this.vx  = (Math.random() - 0.5) * 0.8;
  this.vy  = Math.random() * 0.6 + 0.3;
  const op = Math.random() * 0.5 + 0.2;
  this.col = Math.random() > 0.5
    ? `rgba(245, 200, 66, ${op})`   // ミモザイエロー
    : `rgba(168, 213, 224, ${op})`; // サマーブルー
};
Petal.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
  if (this.y > canvas.height + 10) this.reset();
};
Petal.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  ctx.fillStyle = this.col;
  ctx.fill();
};

// 60粒生成（初期位置はランダム）
const petals = [];
for (let i = 0; i < 60; i++) {
  const p = new Petal();
  p.y = Math.random() * canvas.height;
  petals.push(p);
}

// アニメーションループ
function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animatePetals);
}
animatePetals();

/* ----------------------------------------------------------
   02. Header: スクロールで影を追加
---------------------------------------------------------- */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* ----------------------------------------------------------
   03. ハンバーガーメニュー 開閉
---------------------------------------------------------- */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);
  // メニュー展開中はページスクロールを禁止
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// モバイルナビのリンクをクリックで閉じる
function closeMobile() {
  burger.classList.remove('open');
  mobileNav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ----------------------------------------------------------
   04. スクロールアニメーション (Intersection Observer)
   .reveal / .reveal-left / .reveal-right に .visible を付与
---------------------------------------------------------- */
const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 同時に複数の要素が入ってきたとき少しずらす
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target); // 一度だけ発火
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px',
  }
);

revealTargets.forEach(el => observer.observe(el));

/* ----------------------------------------------------------
   05. スムーズスクロール
   ※ CSS の scroll-behavior: smooth と併用
      ヘッダー分のオフセットを計算して調整
---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = header.offsetHeight;
    const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // モバイルメニューが開いていたら閉じる
    closeMobile();
  });
});
