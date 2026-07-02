// === Constants & Config ===
const TILE = 32;
const LOGIC_W = 480;
const LOGIC_H = 270;
const CHUNK_W = 16;
const GRAVITY = 0.55;
const FRICTION = 0.82;
const AIR_FRICTION = 0.95;
const JUMP_FORCE = 9.5;
const RUN_ACCEL = 0.6;
const MAX_SPEED = 3.2;
const COYOTE_FRAMES = 6;
const JUMP_BUFFER = 4;
const STOMP_BOUNCE = JUMP_FORCE * 0.6;

const TILE_AIR = 0;
const TILE_GROUND = 1;
const TILE_ONEWAY = 2;
const TILE_BLOCK = 3;

const POWER_SPEED = 'speed';
const POWER_DOUBLE = 'double';
const POWER_STAR = 'star';
const POWER_ONEUP = 'oneup';

const SAVE_KEYS = {
  highscore: 'platformer_highscore',
  bestlevel: 'platformer_bestlevel',
  muted: 'platformer_muted',
};

// === Math helpers ===
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function rand(min, max) { return min + Math.random() * (max - min); }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

function aabbOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// === Save / Load ===
const Save = {
  get(key, def) {
    try {
      const v = localStorage.getItem(key);
      if (v === null) return def;
      return JSON.parse(v);
    } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
};

// === Audio Engine ===
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = Save.get(SAVE_KEYS.muted, false);
    this.musicTimer = null;
    this.musicStep = 0;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.initialized = true;
  }

  resume() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    Save.set(SAVE_KEYS.muted, this.muted);
    if (this.muted) this.stopMusic();
    return this.muted;
  }

  playTone(freq, duration, type = 'square', vol = 0.15, attack = 0.01, decay = 0.1) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, t + attack + decay + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + attack + decay + duration + 0.05);
  }

  sfxJump() { this.playTone(300, 0.08, 'square', 0.12, 0.01, 0.05); this.playTone(500, 0.06, 'square', 0.08, 0.02, 0.04); }
  sfxCoin() { this.playTone(880, 0.05, 'sine', 0.15, 0.005, 0.08); this.playTone(1100, 0.05, 'sine', 0.12, 0.01, 0.06); }
  sfxStomp() { this.playTone(150, 0.1, 'square', 0.2, 0.005, 0.1); }
  sfxPowerUp() { [440, 554, 659, 880].forEach((f, i) => setTimeout(() => this.playTone(f, 0.08, 'square', 0.12), i * 60)); }
  sfxHurt() { this.playTone(200, 0.15, 'sawtooth', 0.15, 0.01, 0.12); this.playTone(120, 0.2, 'sawtooth', 0.1, 0.02, 0.15); }
  sfxDeath() { [400, 350, 300, 200, 100].forEach((f, i) => setTimeout(() => this.playTone(f, 0.12, 'square', 0.12), i * 80)); }
  sfxBossHit() { this.playTone(80, 0.2, 'sawtooth', 0.2, 0.01, 0.15); }
  sfxLevelComplete() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.15, 'square', 0.1), i * 100)); }
  sfxCheckpoint() { this.playTone(660, 0.1, 'sine', 0.12); this.playTone(880, 0.1, 'sine', 0.1); }

  startMusic() {
    if (this.muted || !this.ctx) return;
    this.stopMusic();
    const melody = [262, 330, 392, 523, 392, 330, 294, 330, 262, 294, 330, 392];
    this.musicTimer = setInterval(() => {
      if (this.muted) return;
      const freq = melody[this.musicStep % melody.length];
      this.playTone(freq, 0.12, 'square', 0.06, 0.01, 0.08);
      if (this.musicStep % 4 === 0) this.playTone(freq / 2, 0.2, 'triangle', 0.04, 0.01, 0.15);
      this.musicStep++;
    }, 200);
  }

  stopMusic() {
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
  }
}

// === Input ===
class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpPressed = false;
    this.pausePressed = false;
    this.keys = {};
    this._bindKeyboard();
    this._bindTouch();
  }

  _bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
      if (this.keys[e.code]) return;
      this.keys[e.code] = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.right = true;
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        if (!this.jump) this.jumpPressed = true;
        this.jump = true;
      }
      if (['Escape', 'KeyP'].includes(e.code)) this.pausePressed = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.right = false;
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) this.jump = false;
    });
    window.addEventListener('blur', () => {
      this.left = this.right = this.jump = false;
      this.keys = {};
    });
  }

  _bindTouch() {
    const bind = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      const down = (e) => { e.preventDefault(); onDown(); el.classList.add('active'); };
      const up = (e) => { e.preventDefault(); onUp(); el.classList.remove('active'); };
      el.addEventListener('touchstart', down, { passive: false });
      el.addEventListener('touchend', up, { passive: false });
      el.addEventListener('touchcancel', up, { passive: false });
      el.addEventListener('mousedown', down);
      el.addEventListener('mouseup', up);
      el.addEventListener('mouseleave', up);
    };
    bind('btn-left', () => { this.left = true; }, () => { this.left = false; });
    bind('btn-right', () => { this.right = true; }, () => { this.right = false; });
    bind('btn-jump', () => { if (!this.jump) this.jumpPressed = true; this.jump = true; }, () => { this.jump = false; });
    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => { this.pausePressed = true; });
    }
  }

  endFrame() {
    this.jumpPressed = false;
    this.pausePressed = false;
  }
}

// === Camera ===
class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.shake = 0;
    this.shakeDecay = 0.85;
  }

  update(targetX, worldW) {
    const target = clamp(targetX - LOGIC_W * 0.35, 0, Math.max(0, worldW - LOGIC_W));
    this.x = lerp(this.x, target, 0.12);
    this.y = 0;
    if (this.shake > 0.1) this.shake *= this.shakeDecay;
    else this.shake = 0;
  }

  addShake(amount) { this.shake = Math.max(this.shake, amount); }

  apply(ctx) {
    const sx = (Math.random() - 0.5) * this.shake * 2;
    const sy = (Math.random() - 0.5) * this.shake * 2;
    ctx.translate(-Math.floor(this.x) + sx, -Math.floor(this.y) + sy);
  }
}

// === Particles ===
class ParticleSystem {
  constructor() {
    this.pool = [];
    this.max = 200;
  }

  emit(x, y, opts) {
    const count = opts.count || 8;
    for (let i = 0; i < count; i++) {
      let p = this.pool.find(p => !p.alive);
      if (!p) {
        if (this.pool.length >= this.max) continue;
        p = {};
        this.pool.push(p);
      }
      const angle = opts.angle !== undefined ? opts.angle + rand(-0.5, 0.5) : rand(0, Math.PI * 2);
      const speed = opts.speed !== undefined ? rand(opts.speed * 0.5, opts.speed) : rand(1, 4);
      p.x = x; p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = opts.life || rand(20, 40);
      p.maxLife = p.life;
      p.color = opts.color || '#ffd93d';
      p.size = opts.size || rand(2, 5);
      p.gravity = opts.gravity !== undefined ? opts.gravity : 0.1;
      p.alive = true;
    }
  }

  coinBurst(x, y) { this.emit(x, y, { count: 10, color: '#ffd93d', speed: 3, life: 30, size: 3 }); }
  dustCloud(x, y) { this.emit(x, y, { count: 6, color: '#c4a882', speed: 2, life: 20, size: 4, gravity: -0.05, angle: -Math.PI / 2 }); }
  enemyBurst(x, y) { this.emit(x, y, { count: 14, color: '#ff6b6b', speed: 4, life: 35, size: 5 }); }
  powerUpFlash(x, y, color) { this.emit(x, y, { count: 16, color, speed: 5, life: 40, size: 6 }); }
  bossBurst(x, y) { this.emit(x, y, { count: 30, color: '#e74c3c', speed: 6, life: 50, size: 7 }); }

  update() {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
      p.life--;
      if (p.life <= 0) p.alive = false;
    }
  }

  draw(ctx) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// === Score Popups ===
class ScorePopup {
  constructor() { this.items = []; }

  add(x, y, text, color = '#fff') {
    this.items.push({ x, y, text, color, life: 60, vy: -1.5 });
  }

  update() {
    this.items = this.items.filter(p => {
      p.y += p.vy; p.life--;
      return p.life > 0;
    });
  }

  draw(ctx, camX) {
    for (const p of this.items) {
      const alpha = clamp(p.life / 60, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x - camX, p.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }
}

// === Vector Sprites ===
const Sprites = {
  drawPlayer(ctx, x, y, w, h, state, frame, facing, squash, invincible) {
    if (invincible && Math.floor(frame / 4) % 2 === 0) ctx.globalAlpha = 0.5;
    ctx.save();
    ctx.translate(x + w / 2, y + h);
    ctx.scale(squash.x * (facing < 0 ? -1 : 1), squash.y);
    const bw = w * 0.85, bh = h * 0.9;
    const grad = ctx.createLinearGradient(0, -bh, 0, 0);
    grad.addColorStop(0, '#ff6b6b');
    grad.addColorStop(1, '#c0392b');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#922b21';
    ctx.lineWidth = 2;
    this._roundRect(ctx, -bw / 2, -bh, bw, bh, 6);
    ctx.fill(); ctx.stroke();
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-5, -bh + 10, 4, 0, Math.PI * 2);
    ctx.arc(5, -bh + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-4, -bh + 10, 2, 0, Math.PI * 2);
    ctx.arc(6, -bh + 10, 2, 0, Math.PI * 2);
    ctx.fill();
    // Hat
    ctx.fillStyle = '#e74c3c';
    this._roundRect(ctx, -bw / 2 - 2, -bh - 4, bw + 4, 8, 3);
    ctx.fill();
    // Legs animation
    if (state === 'run') {
      const legOff = Math.sin(frame * 0.4) * 4;
      ctx.fillStyle = '#2980b9';
      this._roundRect(ctx, -8, -4, 6, 6 + legOff, 2); ctx.fill();
      this._roundRect(ctx, 2, -4, 6, 6 - legOff, 2); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  },

  drawGoomba(ctx, x, y, w, h, frame) {
    const bounce = Math.sin(frame * 0.15) * 2;
    ctx.save();
    ctx.translate(x + w / 2, y + h + bounce);
    const grad = ctx.createRadialGradient(0, -h / 2, 2, 0, -h / 2, w / 2);
    grad.addColorStop(0, '#a0522d');
    grad.addColorStop(1, '#6b3410');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#4a2508';
    ctx.lineWidth = 2;
    this._roundRect(ctx, -w / 2, -h, w, h, h / 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-5, -h + 10, 3, 0, Math.PI * 2);
    ctx.arc(5, -h + 10, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-5, -h + 10, 1.5, 0, Math.PI * 2);
    ctx.arc(5, -h + 10, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  drawFlyer(ctx, x, y, w, h, frame) {
    const wing = Math.sin(frame * 0.3) * 6;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.fillStyle = '#9b59b6';
    ctx.strokeStyle = '#6c3483';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(200,150,255,0.6)';
    ctx.beginPath();
    ctx.ellipse(-12, wing, 8, 4, -0.3, 0, Math.PI * 2);
    ctx.ellipse(12, -wing, 8, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-4, -2, 3, 0, Math.PI * 2);
    ctx.arc(4, -2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(-4, -2, 1.5, 0, Math.PI * 2);
    ctx.arc(4, -2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  drawBoss(ctx, x, y, w, h, frame, hp, maxHp) {
    const pulse = Math.sin(frame * 0.1) * 2;
    ctx.save();
    ctx.translate(x + w / 2, y + h);
    const grad = ctx.createLinearGradient(0, -h, 0, 0);
    grad.addColorStop(0, '#e74c3c');
    grad.addColorStop(0.5, '#c0392b');
    grad.addColorStop(1, '#7b241c');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#641e16';
    ctx.lineWidth = 3;
    this._roundRect(ctx, -w / 2, -h + pulse, w, h, 10);
    ctx.fill(); ctx.stroke();
    // Horns
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(-w / 3, -h + pulse);
    ctx.lineTo(-w / 3 - 8, -h - 12 + pulse);
    ctx.lineTo(-w / 3 + 8, -h + pulse);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w / 3, -h + pulse);
    ctx.lineTo(w / 3 + 8, -h - 12 + pulse);
    ctx.lineTo(w / 3 - 8, -h + pulse);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(-12, -h + 20 + pulse, 6, 0, Math.PI * 2);
    ctx.arc(12, -h + 20 + pulse, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-12, -h + 20 + pulse, 3, 0, Math.PI * 2);
    ctx.arc(12, -h + 20 + pulse, 3, 0, Math.PI * 2);
    ctx.fill();
    // HP bar
    const barW = w;
    ctx.fillStyle = '#333';
    this._roundRect(ctx, -barW / 2, -h - 16 + pulse, barW, 8, 3);
    ctx.fill();
    ctx.fillStyle = '#2ecc71';
    this._roundRect(ctx, -barW / 2, -h - 16 + pulse, barW * (hp / maxHp), 8, 3);
    ctx.fill();
    ctx.restore();
  },

  drawCoin(ctx, x, y, frame) {
    const bob = Math.sin(frame * 0.1) * 3;
    const scale = Math.abs(Math.cos(frame * 0.08));
    ctx.save();
    ctx.translate(x + 12, y + 12 + bob);
    ctx.scale(Math.max(0.3, scale), 1);
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 10);
    grad.addColorStop(0, '#fff9c4');
    grad.addColorStop(1, '#f9a825');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#f57f17';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f57f17';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 1);
    ctx.restore();
  },

  drawPowerUp(ctx, x, y, type, frame) {
    const bob = Math.sin(frame * 0.12) * 4;
    ctx.save();
    ctx.translate(x + 12, y + 12 + bob);
    const colors = { [POWER_SPEED]: '#3498db', [POWER_DOUBLE]: '#2ecc71', [POWER_STAR]: '#f1c40f', [POWER_ONEUP]: '#e74c3c' };
    const icons = { [POWER_SPEED]: '»', [POWER_DOUBLE]: '↑', [POWER_STAR]: '★', [POWER_ONEUP]: '1' };
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 12);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(1, colors[type] || '#fff');
    ctx.fillStyle = grad;
    ctx.strokeStyle = colors[type] || '#fff';
    ctx.lineWidth = 2;
    this._roundRect(ctx, -12, -12, 24, 24, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[type] || '?', 0, 1);
    ctx.restore();
  },

  drawFlag(ctx, x, y, frame) {
    const wave = Math.sin(frame * 0.08) * 4;
    ctx.save();
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(x, y, 4, 64);
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.moveTo(x + 4, y);
    ctx.lineTo(x + 4 + 24 + wave, y + 12);
    ctx.lineTo(x + 4, y + 24);
    ctx.fill();
    ctx.restore();
  },

  drawCheckpoint(ctx, x, y, active, frame) {
    const glow = active ? Math.sin(frame * 0.1) * 0.3 + 0.7 : 0.4;
    ctx.save();
    ctx.globalAlpha = glow;
    ctx.fillStyle = active ? '#2ecc71' : '#95a5a6';
    ctx.beginPath();
    ctx.moveTo(x, y + 32);
    ctx.lineTo(x + 16, y);
    ctx.lineTo(x + 32, y + 32);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = active ? '#27ae60' : '#7f8c8d';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  },

  drawTile(ctx, col, row, type) {
    const x = col * TILE, y = row * TILE;
    if (type === TILE_GROUND) {
      const grad = ctx.createLinearGradient(x, y, x, y + TILE);
      grad.addColorStop(0, '#6bcb77');
      grad.addColorStop(0.3, '#4d96a9');
      grad.addColorStop(1, '#8B6914');
      ctx.fillStyle = grad;
      this._roundRect(ctx, x, y, TILE, TILE, 3);
      ctx.fill();
      ctx.strokeStyle = '#3d7a44';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Grass tufts
      ctx.fillStyle = '#5ab565';
      for (let i = 0; i < 3; i++) {
        const gx = x + 4 + i * 10;
        ctx.beginPath();
        ctx.moveTo(gx, y + 2);
        ctx.lineTo(gx + 3, y - 4);
        ctx.lineTo(gx + 6, y + 2);
        ctx.fill();
      }
    } else if (type === TILE_ONEWAY) {
      ctx.fillStyle = '#5dade2';
      ctx.strokeStyle = '#2e86c1';
      ctx.lineWidth = 2;
      this._roundRect(ctx, x, y + 4, TILE, TILE - 8, 4);
      ctx.fill(); ctx.stroke();
    } else if (type === TILE_BLOCK) {
      const grad = ctx.createLinearGradient(x, y, x + TILE, y + TILE);
      grad.addColorStop(0, '#27ae60');
      grad.addColorStop(1, '#1e8449');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#145a32';
      ctx.lineWidth = 2;
      this._roundRect(ctx, x, y, TILE, TILE, 4);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      this._roundRect(ctx, x + 4, y + 4, TILE - 8, TILE - 8, 2);
      ctx.fill();
    }
  },

  _roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },
};

// === Level Generator ===
class LevelGenerator {
  constructor() {
    this.tiles = new Map();
    this.entities = [];
    this.checkpoints = [];
    this.levelEnd = 0;
    this.totalChunks = 0;
    this.seed = 0;
    this.rng = null;
  }

  generate(level) {
    this.tiles.clear();
    this.entities = [];
    this.checkpoints = [];
    this.seed = level * 7919 + 42;
    this.rng = seededRandom(this.seed);
    this.totalChunks = Math.min(20, 8 + Math.floor(level / 3));
    const d = Math.floor(level / 3);
    const isBossLevel = level % 5 === 0;

    if (isBossLevel) this.totalChunks = Math.max(this.totalChunks, 10);

    for (let c = 0; c < this.totalChunks; c++) {
      const isLast = c === this.totalChunks - 1;
      const isBossChunk = isBossLevel && isLast;
      const type = isBossChunk ? 'boss_arena' : this._pickChunkType(d, c);
      this._generateChunk(c, type, level, d);
    }

    const cp1 = Math.floor(this.totalChunks / 3);
    const cp2 = Math.floor(2 * this.totalChunks / 3);
    [cp1, cp2].forEach(ci => {
      const cx = ci * CHUNK_W * TILE + CHUNK_W * TILE / 2;
      const groundY = this._findGroundY(Math.floor(cx / TILE));
      this.checkpoints.push({ chunkIndex: ci, x: cx, y: groundY - TILE * 2, active: false });
      this.entities.push({ type: 'checkpoint', x: cx - 16, y: groundY - TILE * 2, w: 32, h: 32, active: false, chunkIndex: ci });
    });

    // End flag
    const endX = this.totalChunks * CHUNK_W * TILE - TILE * 2;
    const endY = this._findGroundY(Math.floor(endX / TILE)) - 64;
    this.entities.push({ type: 'flag', x: endX, y: endY, w: 32, h: 64 });
    this.levelEnd = this.totalChunks * CHUNK_W * TILE;

    return this;
  }

  _pickChunkType(d, chunkIndex) {
    if (chunkIndex === 0) return 'flat';
    const weights = {
      flat: Math.max(2, 8 - d),
      gaps: 2 + d * 1.5,
      stairs: 4,
      platforms: 3 + d * 0.5,
      enemies: 2 + d + chunkIndex * 0.05,
      pipes: Math.max(1, 3 - d * 0.3),
    };
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let r = this.rng() * total;
    for (const [type, w] of Object.entries(weights)) {
      r -= w;
      if (r <= 0) return type;
    }
    return 'flat';
  }

  _generateChunk(chunkIndex, type, level, d) {
    const startCol = chunkIndex * CHUNK_W;
    const gapW = 2 + Math.floor(level / 5);
    const enemySpeed = 1.2 * (1 + level * 0.05);

    const setTile = (col, row, t) => {
      const key = `${col},${row}`;
      if (row >= 0 && row < 12) {
        if (!this.tiles.has(col)) this.tiles.set(col, {});
        this.tiles.get(col)[row] = t;
      }
    };

    const groundRow = 8;

    if (type === 'boss_arena') {
      for (let col = startCol; col < startCol + CHUNK_W; col++) {
        for (let row = groundRow; row < 10; row++) setTile(col, row, TILE_GROUND);
      }
      setTile(startCol, groundRow - 1, TILE_BLOCK);
      setTile(startCol, groundRow - 2, TILE_BLOCK);
      setTile(startCol, groundRow - 3, TILE_BLOCK);
      setTile(startCol + CHUNK_W - 1, groundRow - 1, TILE_BLOCK);
      setTile(startCol + CHUNK_W - 1, groundRow - 2, TILE_BLOCK);
      setTile(startCol + CHUNK_W - 1, groundRow - 3, TILE_BLOCK);
      const bx = (startCol + CHUNK_W / 2) * TILE;
      this.entities.push({
        type: 'boss', x: bx - 32, y: groundRow * TILE - 64, w: 64, h: 64,
        hp: 3, maxHp: 3, vx: enemySpeed, state: 'walk', timer: 0, dir: -1,
        chunkIndex,
      });
      return;
    }

    if (type === 'flat') {
      for (let col = startCol; col < startCol + CHUNK_W; col++) {
        for (let row = groundRow; row < 10; row++) setTile(col, row, TILE_GROUND);
      }
      const coinCount = randInt(0, 2);
      for (let i = 0; i < coinCount; i++) {
        const cx = (startCol + randInt(2, CHUNK_W - 3)) * TILE;
        this.entities.push({ type: 'coin', x: cx, y: (groundRow - 2) * TILE, w: 24, h: 24, collected: false });
      }
    } else if (type === 'gaps') {
      let col = startCol;
      while (col < startCol + CHUNK_W) {
        const segLen = randInt(3, 6);
        const gapLen = randInt(1, Math.min(3, 1 + Math.floor(gapW / 2)));
        for (let i = 0; i < segLen && col < startCol + CHUNK_W; i++, col++) {
          for (let row = groundRow; row < 10; row++) setTile(col, row, TILE_GROUND);
        }
        col += gapLen;
      }
    } else if (type === 'stairs') {
      for (let col = startCol; col < startCol + CHUNK_W; col++) {
        const offset = Math.floor((col - startCol) / 2);
        const baseRow = groundRow - Math.min(offset, 3);
        for (let row = baseRow; row < 10; row++) setTile(col, row, TILE_GROUND);
      }
    } else if (type === 'platforms') {
      for (let col = startCol; col < startCol + CHUNK_W; col++) {
        for (let row = groundRow; row < 10; row++) setTile(col, row, TILE_GROUND);
      }
      const platCount = randInt(2, 4);
      for (let i = 0; i < platCount; i++) {
        const pc = startCol + randInt(1, CHUNK_W - 3);
        const pr = groundRow - randInt(2, 4);
        const pw = randInt(2, 4);
        for (let j = 0; j < pw; j++) setTile(pc + j, pr, TILE_ONEWAY);
      }
    } else if (type === 'enemies') {
      for (let col = startCol; col < startCol + CHUNK_W; col++) {
        for (let row = groundRow; row < 10; row++) setTile(col, row, TILE_GROUND);
      }
      const count = randInt(1, Math.min(3, 1 + Math.floor(d / 2)));
      for (let i = 0; i < count; i++) {
        const ex = (startCol + randInt(2, CHUNK_W - 3)) * TILE;
        const ey = groundRow * TILE - 28;
        const etype = level >= 4 && this.rng() > 0.5 ? 'flyer' : 'goomba';
        this.entities.push({
          type: etype, x: ex, y: etype === 'flyer' ? ey - 40 : ey, w: 28, h: 28,
          vx: enemySpeed * (this.rng() > 0.5 ? 1 : -1), baseY: ey - 40, phase: this.rng() * Math.PI * 2,
          alive: true, chunkIndex,
        });
      }
    } else if (type === 'pipes') {
      for (let col = startCol; col < startCol + CHUNK_W; col++) {
        for (let row = groundRow; row < 10; row++) setTile(col, row, TILE_GROUND);
      }
      const pipeCol = startCol + randInt(3, CHUNK_W - 5);
      for (let row = groundRow - 2; row <= groundRow; row++) {
        setTile(pipeCol, row, TILE_BLOCK);
        setTile(pipeCol + 1, row, TILE_BLOCK);
      }
      setTile(pipeCol, groundRow - 3, TILE_BLOCK);
      setTile(pipeCol + 1, groundRow - 3, TILE_BLOCK);
    }

    // Seam fill: ensure chunk edges connect
    if (chunkIndex > 0) {
      const prevCol = startCol - 1;
      const prevTile = this.getTile(prevCol, groundRow);
      if (prevTile === TILE_GROUND || prevTile === TILE_BLOCK) {
        for (let row = groundRow; row < 10; row++) setTile(startCol, row, TILE_GROUND);
      }
    }

    // Random power-up
    if (this.rng() < 0.12) {
      const types = [POWER_SPEED, POWER_DOUBLE, POWER_STAR];
      if (this.rng() < 0.08) types.push(POWER_ONEUP);
      const ptype = types[randInt(0, types.length - 1)];
      const px = (startCol + randInt(2, CHUNK_W - 3)) * TILE;
      this.entities.push({ type: 'powerup', powerType: ptype, x: px, y: (groundRow - 3) * TILE, w: 24, h: 24, collected: false });
    }

    // Extra coins
    if (this.rng() < 0.3) {
      const cx = (startCol + randInt(1, CHUNK_W - 2)) * TILE;
      this.entities.push({ type: 'coin', x: cx, y: (groundRow - 1) * TILE, w: 24, h: 24, collected: false });
    }
  }

  getTile(col, row) {
    if (!this.tiles.has(col)) return TILE_AIR;
    return this.tiles.get(col)[row] || TILE_AIR;
  }

  _findGroundY(col) {
    for (let row = 0; row < 12; row++) {
      const t = this.getTile(col, row);
      if (t === TILE_GROUND || t === TILE_BLOCK) return row * TILE;
    }
    return 8 * TILE;
  }

  getWorldWidth() {
    return this.totalChunks * CHUNK_W * TILE;
  }
}

// === Player ===
class Player {
  constructor() {
    this.reset(64, 0);
    this.w = 24;
    this.h = 32;
    this.lives = 3;
    this.score = 0;
    this.coins = 0;
    this.facing = 1;
    this.state = 'idle';
    this.frame = 0;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.onGround = false;
    this.squash = { x: 1, y: 1 };
    this.invincible = 0;
    this.powerups = {};
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
    this.combo = 0;
    this.comboTimer = 0;
    this.dead = false;
    this.deathTimer = 0;
  }

  reset(x, y) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.dead = false;
    this.deathTimer = 0;
    this.invincible = 90;
    this.hasDoubleJumped = false;
    this.state = 'idle';
  }

  getHitbox() {
    const margin = this.w * 0.15;
    return { x: this.x + margin, y: this.y + 4, w: this.w - margin * 2, h: this.h - 4 };
  }

  getMaxSpeed() {
    return this.powerups[POWER_SPEED] ? MAX_SPEED * 1.6 : MAX_SPEED;
  }

  hasStar() { return this.powerups[POWER_STAR] > 0; }

  update(input, tiles, dt) {
    if (this.dead) {
      this.deathTimer++;
      this.vy += GRAVITY;
      this.y += this.vy;
      return;
    }

    this.frame++;
    const maxSpd = this.getMaxSpeed();

    if (input.left) { this.vx -= RUN_ACCEL; this.facing = -1; }
    if (input.right) { this.vx += RUN_ACCEL; this.facing = 1; }
    if (!input.left && !input.right) this.vx *= this.onGround ? FRICTION : AIR_FRICTION;
    this.vx = clamp(this.vx, -maxSpd, maxSpd);

    if (this.onGround) { this.coyote = COYOTE_FRAMES; this.hasDoubleJumped = false; }
    else if (this.coyote > 0) this.coyote--;

    if (input.jumpPressed) this.jumpBuffer = JUMP_BUFFER;
    if (this.jumpBuffer > 0) this.jumpBuffer--;

    const canJump = this.coyote > 0 || (this.powerups[POWER_DOUBLE] && !this.hasDoubleJumped && !this.onGround);
    if (this.jumpBuffer > 0 && canJump) {
      this.vy = -JUMP_FORCE;
      this.coyote = 0;
      this.jumpBuffer = 0;
      if (!this.onGround && this.powerups[POWER_DOUBLE]) this.hasDoubleJumped = true;
      this.squash = { x: 1.3, y: 0.7 };
      return 'jump';
    }

    this.vy += GRAVITY;
    const hb = this.getHitbox();
    const wasOnGround = this.onGround;

    // X collision
    let newX = this.x + this.vx;
    const testX = { x: newX + (this.w - hb.w) / 2 + hb.w * 0.15, y: hb.y, w: hb.w, h: hb.h };
    if (this._collideTiles(testX, tiles)) {
      this.vx = 0;
    } else {
      this.x = newX;
    }

    // Y collision
    let newY = this.y + this.vy;
    const testY = { x: this.getHitbox().x, y: newY + 4, w: this.getHitbox().w, h: this.getHitbox().h };
    this.onGround = false;
    const col = this._collideTilesY(testY, tiles, this.vy);
    if (col.hit) {
      if (this.vy > 0) {
        this.onGround = true;
        this.y = col.top - this.h;
        if (!wasOnGround) {
          this.squash = { x: 1.2, y: 0.8 };
          return 'land';
        }
      } else {
        this.y = col.bottom;
      }
      this.vy = 0;
    } else {
      this.y = newY;
    }

    // Squash recovery
    this.squash.x = lerp(this.squash.x, 1, 0.2);
    this.squash.y = lerp(this.squash.y, 1, 0.2);

    if (this.invincible > 0) this.invincible--;
    for (const k of Object.keys(this.powerups)) {
      this.powerups[k]--;
      if (this.powerups[k] <= 0) delete this.powerups[k];
    }

    if (this.comboTimer > 0) { this.comboTimer--; if (this.comboTimer <= 0) this.combo = 0; }

    if (this.onGround) this.state = Math.abs(this.vx) > 0.5 ? 'run' : 'idle';
    else this.state = this.vy < 0 ? 'jump' : 'fall';

    if (this.y > LOGIC_H + 100) return 'fall_death';
    return null;
  }

  _collideTiles(box, tiles) {
    const c0 = Math.floor(box.x / TILE), c1 = Math.floor((box.x + box.w) / TILE);
    const r0 = Math.floor(box.y / TILE), r1 = Math.floor((box.y + box.h) / TILE);
    for (let c = c0; c <= c1; c++) {
      for (let r = r0; r <= r1; r++) {
        const t = tiles.getTile(c, r);
        if (t === TILE_GROUND || t === TILE_BLOCK) return true;
      }
    }
    return false;
  }

  _collideTilesY(box, tiles, vy) {
    const c0 = Math.floor(box.x / TILE), c1 = Math.floor((box.x + box.w) / TILE);
    const r0 = Math.floor(box.y / TILE), r1 = Math.floor((box.y + box.h) / TILE);
    for (let c = c0; c <= c1; c++) {
      for (let r = r0; r <= r1; r++) {
        const t = tiles.getTile(c, r);
        if (t === TILE_GROUND || t === TILE_BLOCK) {
          if (vy > 0) return { hit: true, top: r * TILE };
          else return { hit: true, bottom: (r + 1) * TILE + this.h };
        }
        if (t === TILE_ONEWAY && vy > 0 && box.y + box.h - vy <= r * TILE + 4) {
          return { hit: true, top: r * TILE };
        }
      }
    }
    return { hit: false };
  }

  stompBounce() {
    this.vy = -STOMP_BOUNCE;
    this.squash = { x: 1.2, y: 0.8 };
    this.combo++;
    this.comboTimer = 120;
  }

  hurt() {
    if (this.invincible > 0 || this.hasStar()) return false;
    this.lives--;
    this.invincible = 120;
    this.vy = -JUMP_FORCE * 0.5;
    this.vx = -this.facing * 3;
    return true;
  }

  die() {
    this.dead = true;
    this.vy = -6;
    this.state = 'dead';
  }
}

// === Game ===
class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.input = new Input();
    this.audio = new AudioEngine();
    this.camera = new Camera();
    this.particles = new ParticleSystem();
    this.popups = new ScorePopup();
    this.levelGen = new LevelGenerator();
    this.player = new Player();

    this.state = 'menu';
    this.level = 1;
    this.animFrame = 0;
    this.fadeAlpha = 0;
    this.fadeDir = 0;
    this.flashAlpha = 0;
    this.flashColor = '#fff';
    this.levelComplete = false;
    this.levelCompleteTimer = 0;
    this.lastCheckpoint = { x: 64, y: 0 };
    this.globalFrame = 0;

    this._bindUI();
    this._resize();
    window.addEventListener('resize', () => this._resize());
    this._updateMenuStats();
    requestAnimationFrame((t) => this._loop(t));
  }

  _bindUI() {
    document.getElementById('btn-start').addEventListener('click', () => this._startGame());
    document.getElementById('btn-retry').addEventListener('click', () => this._startGame());
    document.getElementById('btn-resume').addEventListener('click', () => this._resume());
    document.getElementById('btn-quit').addEventListener('click', () => this._quitToMenu());
    document.getElementById('btn-menu').addEventListener('click', () => this._quitToMenu());
    document.getElementById('btn-mute').addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      document.getElementById('btn-mute').textContent = `Sound: ${muted ? 'OFF' : 'ON'}`;
    });
    const muted = this.audio.muted;
    document.getElementById('btn-mute').textContent = `Sound: ${muted ? 'OFF' : 'ON'}`;
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    const scale = Math.min(window.innerWidth / LOGIC_W, window.innerHeight / LOGIC_H);
    this.canvas.width = LOGIC_W * dpr;
    this.canvas.height = LOGIC_H * dpr;
    this.canvas.style.width = `${LOGIC_W * scale}px`;
    this.canvas.style.height = `${LOGIC_H * scale}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dpr = dpr;
  }

  _updateMenuStats() {
    const hs = Save.get(SAVE_KEYS.highscore, 0);
    const bl = Save.get(SAVE_KEYS.bestlevel, 0);
    document.getElementById('menu-stats').innerHTML =
      `High Score: <strong>${hs}</strong><br>Best Level: <strong>${bl}</strong>`;
  }

  _showOverlay(id) {
    ['overlay-menu', 'overlay-pause', 'overlay-gameover'].forEach(oid => {
      document.getElementById(oid).classList.toggle('hidden', oid !== id);
    });
  }

  _startGame() {
    this.audio.resume();
    this.audio.startMusic();
    this.level = 1;
    this.player = new Player();
    this._loadLevel();
    this.state = 'playing';
    this._showOverlay(null);
    this._fadeIn();
  }

  _resume() {
    this.state = 'playing';
    this._showOverlay(null);
    this.audio.startMusic();
  }

  _quitToMenu() {
    this.state = 'menu';
    this.audio.stopMusic();
    this._showOverlay('overlay-menu');
    this._updateMenuStats();
  }

  _gameOver() {
    this.state = 'gameover';
    this.audio.stopMusic();
    this.audio.sfxDeath();
    const hs = Save.get(SAVE_KEYS.highscore, 0);
    if (this.player.score > hs) Save.set(SAVE_KEYS.highscore, this.player.score);
    const bl = Save.get(SAVE_KEYS.bestlevel, 0);
    if (this.level > bl) Save.set(SAVE_KEYS.bestlevel, this.level);
    document.getElementById('gameover-stats').innerHTML =
      `Score: <strong>${this.player.score}</strong><br>Level Reached: <strong>${this.level}</strong><br>Coins: <strong>${this.player.coins}</strong>`;
    this._showOverlay('overlay-gameover');
  }

  _loadLevel() {
    this.levelGen.generate(this.level);
    const sy = this.levelGen._findGroundY(2) - this.player.h;
    this.player.reset(64, sy);
    this.lastCheckpoint = { x: 64, y: sy };
    this.camera.x = 0;
    this.levelComplete = false;
    this.levelCompleteTimer = 0;
  }

  _fadeIn() { this.fadeAlpha = 1; this.fadeDir = -0.04; }
  _fadeOut() { this.fadeDir = 0.04; }

  _loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    let dt = timestamp - this.lastTime;
    this.lastTime = timestamp;
    if (dt > 50) dt = 50;

    this.globalFrame++;
    this._update(dt);
    this._render();
    this.input.endFrame();
    requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    if (this.fadeDir !== 0) {
      this.fadeAlpha = clamp(this.fadeAlpha + this.fadeDir, 0, 1);
      if (this.fadeAlpha <= 0) this.fadeDir = 0;
    }
    if (this.flashAlpha > 0) this.flashAlpha = Math.max(0, this.flashAlpha - 0.05);

    if (this.state === 'menu' || this.state === 'gameover') return;

    if (this.input.pausePressed && this.state === 'playing') {
      this.state = 'paused';
      this.audio.stopMusic();
      this._showOverlay('overlay-pause');
      return;
    }

    if (this.state === 'paused') return;

    this._updatePlaying();
  }

  _updatePlaying() {
    const p = this.player;
    const lg = this.levelGen;

    if (this.levelComplete) {
      this.levelCompleteTimer++;
      if (this.levelCompleteTimer > 120) {
        this.level++;
        this._fadeOut();
        setTimeout(() => {
          this._loadLevel();
          this._fadeIn();
        }, 500);
        this.levelComplete = false;
      }
      return;
    }

    const result = p.update(this.input, lg, 1);
    if (result === 'jump') { this.audio.sfxJump(); this.particles.dustCloud(p.x + p.w / 2, p.y + p.h); }
    if (result === 'land') this.particles.dustCloud(p.x + p.w / 2, p.y + p.h);
    if (result === 'fall_death') { this._handleDeath(true); return; }

    this.camera.update(p.x, lg.getWorldWidth());
    this.particles.update();
    this.popups.update();

    // Checkpoints
    for (const e of lg.entities) {
      if (e.type !== 'checkpoint' || e.active) continue;
      if (aabbOverlap(p.getHitbox(), e)) {
        e.active = true;
        this.lastCheckpoint = { x: e.x + 8, y: this.levelGen._findGroundY(Math.floor((e.x + 8) / TILE)) - p.h };
        this.audio.sfxCheckpoint();
        this.popups.add(e.x, e.y - 10, 'CHECKPOINT!', '#2ecc71');
      }
    }

    // Coins & powerups
    for (const e of lg.entities) {
      if (e.collected) continue;
      if (e.type === 'coin' && aabbOverlap(p.getHitbox(), e)) {
        e.collected = true;
        p.coins++;
        const pts = 100 * (1 + p.combo * 0.5);
        p.score += Math.floor(pts);
        this.audio.sfxCoin();
        this.particles.coinBurst(e.x + 12, e.y + 12);
        this.popups.add(e.x, e.y, `+${Math.floor(pts)}`, '#ffd93d');
      }
      if (e.type === 'powerup' && aabbOverlap(p.getHitbox(), e)) {
        e.collected = true;
        this._applyPowerUp(e.powerType);
      }
    }

    // Enemies
    for (const e of lg.entities) {
      if (!e.alive && e.type !== 'boss') continue;
      if (e.type === 'goomba' || e.type === 'flyer') this._updateEnemy(e, lg);
      if (e.type === 'boss' && e.hp > 0) this._updateBoss(e);
      if (!e.alive || (e.type === 'boss' && e.hp <= 0)) continue;

      const pb = p.getHitbox();
      const stompZone = { x: pb.x, y: pb.y + pb.h - 6, w: pb.w, h: 10 };
      const eb = { x: e.x, y: e.y, w: e.w, h: e.h };

      if (p.vy > 0 && aabbOverlap(stompZone, eb)) {
        if (e.type === 'boss') {
          e.hp--;
          p.stompBounce();
          this.audio.sfxBossHit();
          this.camera.addShake(6);
          this.particles.enemyBurst(e.x + e.w / 2, e.y);
          if (e.hp <= 0) this._defeatBoss(e);
        } else {
          e.alive = false;
          p.stompBounce();
          const pts = 200 * (1 + p.combo * 0.5);
          p.score += Math.floor(pts);
          this.audio.sfxStomp();
          this.camera.addShake(3);
          this.particles.enemyBurst(e.x + e.w / 2, e.y + e.h / 2);
          this.popups.add(e.x, e.y, `+${Math.floor(pts)}`, '#ff6b6b');
        }
      } else if (aabbOverlap(pb, eb)) {
        if (p.hasStar()) {
          if (e.type !== 'boss') {
            e.alive = false;
            p.score += 200;
            this.particles.enemyBurst(e.x + e.w / 2, e.y + e.h / 2);
          } else {
            e.hp--;
            this.audio.sfxBossHit();
            if (e.hp <= 0) this._defeatBoss(e);
          }
        } else if (p.hurt()) {
          this.audio.sfxHurt();
          this.camera.addShake(8);
          if (p.lives <= 0) p.die();
        }
      }
    }

    // Flag / level end
    const flag = lg.entities.find(e => e.type === 'flag');
    if (flag && p.x > flag.x - 20) {
      this.levelComplete = true;
      this.levelCompleteTimer = 0;
      p.score += 1000;
      this.audio.sfxLevelComplete();
      this.popups.add(p.x, p.y - 20, 'LEVEL CLEAR! +1000', '#2ecc71');
      const bl = Save.get(SAVE_KEYS.bestlevel, 0);
      if (this.level >= bl) Save.set(SAVE_KEYS.bestlevel, this.level);
      const hs = Save.get(SAVE_KEYS.highscore, 0);
      if (p.score > hs) Save.set(SAVE_KEYS.highscore, p.score);
    }

    if (p.dead && p.deathTimer > 90) this._handleDeath(false);
  }

  _updateEnemy(e, lg) {
    if (!e.alive) return;
    e.frame = (e.frame || 0) + 1;

    if (e.type === 'flyer') {
      e.x += e.vx;
      e.y = e.baseY + Math.sin(e.frame * 0.05 + e.phase) * 20;
      const col = Math.floor(e.x / TILE);
      const leftTile = lg.getTile(col, Math.floor((e.y + e.h) / TILE));
      const rightTile = lg.getTile(col + 1, Math.floor((e.y + e.h) / TILE));
      if (e.x < 0 || e.x > lg.getWorldWidth()) e.vx *= -1;
      return;
    }

    e.x += e.vx;
    const footCol = Math.floor((e.x + e.w / 2) / TILE);
    const footRow = Math.floor((e.y + e.h + 2) / TILE);
    const groundBelow = lg.getTile(footCol, footRow);
    const groundAhead = lg.getTile(footCol + (e.vx > 0 ? 1 : -1), footRow);
    const wallAhead = lg.getTile(footCol + (e.vx > 0 ? 1 : -1), footRow - 1);

    if (groundBelow === TILE_AIR || wallAhead === TILE_GROUND || wallAhead === TILE_BLOCK || groundAhead === TILE_AIR) {
      e.vx *= -1;
    }
    if (e.x < 0 || e.x > lg.getWorldWidth()) e.vx *= -1;
  }

  _updateBoss(e) {
    e.frame = (e.frame || 0) + 1;
    e.timer = (e.timer || 0) + 1;
    const p = this.player;

    if (e.state === 'walk') {
      e.x += e.vx * e.dir;
      if (e.timer > 90) { e.state = 'pause'; e.timer = 0; }
      if (e.x < e.chunkIndex * CHUNK_W * TILE + 32) e.dir = 1;
      if (e.x > (e.chunkIndex + 1) * CHUNK_W * TILE - 96) e.dir = -1;
    } else if (e.state === 'pause') {
      if (e.timer > 40) { e.state = 'charge'; e.timer = 0; e.chargeDir = p.x > e.x ? 1 : -1; }
    } else if (e.state === 'charge') {
      e.x += e.chargeDir * e.vx * 2.5;
      if (e.timer > 50) { e.state = 'walk'; e.timer = 0; }
    }
  }

  _defeatBoss(e) {
    e.hp = 0;
    this.player.score += 5000;
    this.audio.sfxLevelComplete();
    this.camera.addShake(12);
    this.particles.bossBurst(e.x + e.w / 2, e.y + e.h / 2);
    this.popups.add(e.x, e.y, 'BOSS DEFEATED! +5000', '#e74c3c');
    this.levelComplete = true;
    this.levelCompleteTimer = 0;
  }

  _applyPowerUp(type) {
    const p = this.player;
    this.audio.sfxPowerUp();
    this.camera.addShake(4);
    const colors = { [POWER_SPEED]: '#3498db', [POWER_DOUBLE]: '#2ecc71', [POWER_STAR]: '#f1c40f', [POWER_ONEUP]: '#e74c3c' };
    this.particles.powerUpFlash(p.x + p.w / 2, p.y + p.h / 2, colors[type]);
    this.flashColor = colors[type];
    this.flashAlpha = 0.4;

    if (type === POWER_ONEUP) { p.lives++; this.popups.add(p.x, p.y - 20, '1-UP!', '#e74c3c'); return; }
    const durations = { [POWER_SPEED]: 480, [POWER_DOUBLE]: 600, [POWER_STAR]: 360 };
    p.powerups[type] = durations[type];
    const labels = { [POWER_SPEED]: 'SPEED!', [POWER_DOUBLE]: 'DOUBLE JUMP!', [POWER_STAR]: 'INVINCIBLE!' };
    this.popups.add(p.x, p.y - 20, labels[type], colors[type]);
  }

  _handleDeath(fromFall = false) {
    const p = this.player;
    if (fromFall && !p.dead) {
      p.lives--;
      this.audio.sfxDeath();
      this.camera.addShake(8);
    }
    if (p.lives > 0) {
      const sy = this.levelGen._findGroundY(Math.floor(this.lastCheckpoint.x / TILE)) - p.h;
      p.reset(this.lastCheckpoint.x, sy);
      this.audio.sfxHurt();
      this.camera.addShake(5);
    } else {
      this._gameOver();
    }
  }

  _render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, LOGIC_W, LOGIC_H);

    if (this.state === 'menu' || this.state === 'gameover') {
      this._drawParallax(ctx, 0);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      ctx.restore();
      return;
    }

    this._drawParallax(ctx, this.camera.x);

    ctx.save();
    this.camera.apply(ctx);
    this._drawTiles(ctx);
    this._drawEntities(ctx);
    this.particles.draw(ctx);
    this.popups.draw(ctx, 0);

    const p = this.player;
    if (!p.dead || p.deathTimer < 60) {
      Sprites.drawPlayer(ctx, p.x, p.y, p.w, p.h, p.state, p.frame, p.facing, p.squash, p.invincible > 0 && !p.hasStar());
    }

    ctx.restore();

    this._drawHUD(ctx);

    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      ctx.globalAlpha = 1;
    }

    if (this.fadeAlpha > 0) {
      ctx.fillStyle = '#000';
      ctx.globalAlpha = this.fadeAlpha;
      ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  _drawParallax(ctx, camX) {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGIC_H);
    sky.addColorStop(0, '#87CEEB');
    sky.addColorStop(0.6, '#b8e0f0');
    sky.addColorStop(1, '#6bcb77');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);

    const farOff = camX * 0.2;
    ctx.fillStyle = '#5d8a66';
    for (let i = -1; i < 6; i++) {
      const hx = i * 160 - (farOff % 160);
      ctx.beginPath();
      ctx.moveTo(hx, LOGIC_H);
      ctx.quadraticCurveTo(hx + 80, LOGIC_H - 70 - (i % 3) * 12, hx + 160, LOGIC_H);
      ctx.fill();
    }

    const midOff = camX * 0.4;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 5; i++) {
      const cx = i * 120 - (midOff % 120) - 20;
      const cy = 28 + (i % 3) * 22;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.arc(cx + 18, cy - 4, 20, 0, Math.PI * 2);
      ctx.arc(cx + 38, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    const nearOff = camX * 0.6;
    ctx.fillStyle = '#3d7a44';
    for (let i = -1; i < 9; i++) {
      const bx = i * 70 - (nearOff % 70);
      ctx.beginPath();
      ctx.arc(bx, LOGIC_H - 18, 14, 0, Math.PI * 2);
      ctx.arc(bx + 18, LOGIC_H - 22, 16, 0, Math.PI * 2);
      ctx.arc(bx + 34, LOGIC_H - 16, 11, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _drawTiles(ctx) {
    const camX = this.camera.x;
    const c0 = Math.floor(camX / TILE) - 1;
    const c1 = Math.ceil((camX + LOGIC_W) / TILE) + 1;
    for (let col = c0; col <= c1; col++) {
      for (let row = 0; row < 12; row++) {
        const t = this.levelGen.getTile(col, row);
        if (t !== TILE_AIR) Sprites.drawTile(ctx, col, row, t);
      }
    }
  }

  _drawEntities(ctx) {
    const frame = this.globalFrame;
    const drawables = this.levelGen.entities.filter(e => {
      if (e.type === 'coin' || e.type === 'powerup') return !e.collected;
      if (e.type === 'goomba' || e.type === 'flyer') return e.alive;
      if (e.type === 'boss') return e.hp > 0;
      return true;
    });

    drawables.sort((a, b) => a.y - b.y);

    for (const e of drawables) {
      if (e.x + (e.w || 32) < this.camera.x - 50 || e.x > this.camera.x + LOGIC_W + 50) continue;
      switch (e.type) {
        case 'coin': Sprites.drawCoin(ctx, e.x, e.y, frame); break;
        case 'powerup': Sprites.drawPowerUp(ctx, e.x, e.y, e.powerType, frame); break;
        case 'goomba': Sprites.drawGoomba(ctx, e.x, e.y, e.w, e.h, e.frame || 0); break;
        case 'flyer': Sprites.drawFlyer(ctx, e.x, e.y, e.w, e.h, e.frame || 0); break;
        case 'boss': Sprites.drawBoss(ctx, e.x, e.y, e.w, e.h, e.frame || 0, e.hp, e.maxHp); break;
        case 'flag': Sprites.drawFlag(ctx, e.x, e.y, frame); break;
        case 'checkpoint': Sprites.drawCheckpoint(ctx, e.x, e.y, e.active, frame); break;
      }
    }
  }

  _drawHUD(ctx) {
    const p = this.player;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, LOGIC_W, 28);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';

    ctx.fillText(`SCORE: ${p.score}`, 8, 18);
    ctx.fillText(`COINS: ${p.coins}`, 130, 18);
    ctx.fillText(`LIVES: ${'♥'.repeat(Math.max(0, p.lives))}`, 230, 18);
    ctx.fillText(`LEVEL: ${this.level}`, 370, 18);

    // Power-up timers
    let barX = 8, barY = 24;
    const labels = { [POWER_SPEED]: 'SPD', [POWER_DOUBLE]: '2XJ', [POWER_STAR]: 'STAR' };
    const colors = { [POWER_SPEED]: '#3498db', [POWER_DOUBLE]: '#2ecc71', [POWER_STAR]: '#f1c40f' };
    for (const [type, remaining] of Object.entries(p.powerups)) {
      if (!labels[type]) continue;
      const max = type === POWER_SPEED ? 480 : type === POWER_DOUBLE ? 600 : 360;
      const pct = remaining / max;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(barX, barY, 50, 6);
      ctx.fillStyle = colors[type];
      ctx.fillRect(barX, barY, 50 * pct, 6);
      ctx.fillStyle = '#fff';
      ctx.font = '8px sans-serif';
      ctx.fillText(labels[type], barX + 2, barY + 5);
      barX += 56;
    }

    if (p.combo > 1) {
      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${p.combo}x COMBO!`, LOGIC_W / 2, 50);
      ctx.textAlign = 'left';
    }

    if (this.levelComplete) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, LOGIC_H / 2 - 20, LOGIC_W, 40);
      ctx.fillStyle = '#2ecc71';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LEVEL COMPLETE!', LOGIC_W / 2, LOGIC_H / 2 + 6);
      ctx.textAlign = 'left';
    }
  }
}

// === Bootstrap ===
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
