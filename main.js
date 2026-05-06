/* ─── CUSTOM CURSOR ───────────────────────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .project-card, .edu-card, .research-card, .award-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─── CANVAS BACKGROUND ───────────────────────────────────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100,255,218,${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(100,255,218,${0.06 * (1 - dist/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

(function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animCanvas);
})();

/* ─── NAV SCROLL ──────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── SCROLL REVEAL ───────────────────────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
reveals.forEach(r => io.observe(r));

/* ─── TIMELINE REVEAL ─────────────────────────────────────────────────────── */
const tlItems = document.querySelectorAll('.timeline-item');
const tlio = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      tlio.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
tlItems.forEach(t => tlio.observe(t));

/* ─── SKILL BARS ──────────────────────────────────────────────────────────── */
const bars = document.querySelectorAll('.skill-bar-fill');
const sbio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('animated'); sbio.unobserve(e.target); }
  });
}, { threshold: 0.3 });
bars.forEach(b => sbio.observe(b));

/* ─── ACTIVE NAV SECTION ──────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
const spio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--teal)';
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => spio.observe(s));

/* ─── TYPEWRITER ──────────────────────────────────────────────────────────── */
const roles = [
  'AI Researcher',
  'Full-Stack Developer',
  'Community Builder',
  'Founder',
];
let ri = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
  const current = roles[ri];
  tw.textContent = current.slice(0, ci);
  if (!deleting && ci === current.length) {
    setTimeout(() => { deleting = true; type(); }, 2000);
    return;
  }
  if (deleting && ci === 0) {
    deleting = false;
    ri = (ri + 1) % roles.length;
  }
  ci += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 90);
}
setTimeout(type, 1800);
