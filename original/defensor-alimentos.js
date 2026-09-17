
/** ==========================================
 *  AUDIO ENGINE (Web Audio API)
 *  ========================================== */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let musicInterval;
let isMuted = false;

function playTone(freq, type, duration, vol=0.1) {
    if(isMuted || audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

const sfx = {
    jump: () => playTone(350, 'sine', 0.15, 0.05),
    hit: () => playTone(100, 'sawtooth', 0.4, 0.2),
    coin: () => { playTone(1200, 'square', 0.1, 0.05); setTimeout(()=>playTone(1600, 'square', 0.2, 0.05), 100); },
    powerup: () => { playTone(600, 'triangle', 0.1, 0.1); setTimeout(()=>playTone(800, 'triangle', 0.1, 0.1), 100); setTimeout(()=>playTone(1000, 'triangle', 0.3, 0.1), 200); },
    shoot: () => playTone(800, 'square', 0.1, 0.05),
    enemyShoot: () => playTone(200, 'sawtooth', 0.1, 0.05),
    door: () => { playTone(400, 'triangle', 0.2, 0.1); setTimeout(()=>playTone(600, 'triangle', 0.4, 0.1), 200); }
};

const melodyNormal = [329.63, null, 329.63, null, 329.63, 261.63, 329.63, null, 392.00, null, null, null, 196.00, null, null, null];
const bassNormal   = [130.81, 130.81, 130.81, 130.81, 196.00, 196.00, 196.00, 196.00];
const melodyPanic = [493.88, 523.25, 493.88, 587.33, 493.88, 523.25, 493.88, null];
const bassPanic   = [164.81, null, 164.81, 174.61, 164.81, null, 164.81, 196.00];

function startMusic(isPanic = false) {
    if(musicInterval) clearInterval(musicInterval);
    let step = 0;
    let speed = isPanic ? 100 : 150; 
    let mTrack = isPanic ? melodyPanic : melodyNormal;
    let bTrack = isPanic ? bassPanic : bassNormal;

    musicInterval = setInterval(() => {
        if((gameState === 'playing' || gameState === 'start') && !isMuted) {
            let mFreq = mTrack[step % mTrack.length];
            if(mFreq) playTone(mFreq, isPanic ? 'sawtooth' : 'square', 0.1, isPanic ? 0.03 : 0.02);
            let bFreq = bTrack[step % bTrack.length];
            if(bFreq) playTone(bFreq, 'triangle', 0.15, 0.04);
            step++;
        }
    }, speed);
}

window.toggleAudio = function() {
    isMuted = !isMuted;
    document.getElementById('audioControl').innerText = isMuted ? "🔇" : "🔊";
}

/** ==========================================
 *  SISTEMA PEDAGÓGICO SINCRONIZADO
 *  ========================================== */
const knowledgeBank = [
    // NIVEL 1
    { powerName: "Doble Salto", powerId: 1, powerIcon: '🥾', pool: [
        { tip: "El lavado de manos debe durar al menos 20 segundos frotando vigorosamente.", q: "¿Cuál es la duración mínima de un buen lavado de manos?", options: ["5 segundos", "20 segundos", "1 minuto"], ans: 1 },
        { tip: "Es obligatorio lavarse las manos después de ir al baño, tocar basura o carne cruda.", q: "¿En qué momento es OBLIGATORIO lavarse las manos?", options: ["Antes de salir del trabajo", "Después de tocar basura o ir al baño", "Solo al inicio del turno"], ans: 1 },
        { tip: "El jabón es fundamental porque rompe la capa de grasa que protege a las bacterias.", q: "¿Por qué es indispensable usar jabón y no solo agua?", options: ["Para que huelan bien", "Rompe la capa de grasa de las bacterias", "Para enfriar las manos"], ans: 1 },
        { tip: "Según la normativa en Colombia, el manipulador no debe usar anillos, aretes ni relojes.", q: "¿Qué artículos están prohibidos al manipular alimentos?", options: ["Delantales blancos", "Anillos, relojes y joyas", "Zapatos cerrados"], ans: 1 },
        { tip: "Se deben usar toallas de papel de un solo uso para secarse las manos, nunca la ropa.", q: "¿Cuál es el método correcto para secarse las manos?", options: ["Con el delantal", "Toalla de tela compartida", "Toallas de papel de un solo uso"], ans: 2 }
    ]},
    // NIVEL 2
    { powerName: "Velocidad", powerId: 2, powerIcon: '⚡', pool: [
        { tip: "La tabla roja es exclusiva para carnes crudas y la verde para frutas/verduras.", q: "¿Para qué se utiliza la tabla de picar de color ROJO?", options: ["Pan y quesos", "Carnes crudas", "Vegetales"], ans: 1 },
        { tip: "La contaminación cruzada ocurre cuando bacterias de un alimento crudo pasan a uno listo para comer.", q: "¿Qué define mejor a la 'Contaminación Cruzada'?", options: ["Cocinar demasiado un alimento", "Transferencia de bacterias de crudo a cocido", "Mezclar comida fría y caliente"], ans: 1 },
        { tip: "Lavar el pollo crudo en el lavaplatos salpica bacterias por toda la cocina.", q: "¿Por qué NO se debe lavar el pollo crudo?", options: ["Pierde su sabor", "Salpica y esparce bacterias", "Se pone duro"], ans: 1 },
        { tip: "Los utensilios usados en carnes crudas deben lavarse antes de usarlos en verduras.", q: "¿Qué hacer con un cuchillo usado para cortar carne cruda?", options: ["Limpiarlo con un trapo seco", "Lavar y desinfectar antes de otro uso", "Usarlo directamente en la ensalada"], ans: 1 },
        { tip: "El personal con heridas abiertas no puede manipular alimentos directamente.", q: "Si tienes una herida abierta en la mano, la norma indica que:", options: ["Puedes cocinar con curita", "No puedes manipular alimentos directamente", "Solo puedes cortar verduras"], ans: 1 }
    ]},
    // NIVEL 3
    { powerName: "Escudo Térmico", powerId: 3, powerIcon: '🛡️', pool: [
        { tip: "La Zona de Peligro de Temperatura está entre los 4°C y los 60°C.", q: "¿Cuál es el rango de la Zona de Peligro donde las bacterias se multiplican?", options: ["4°C a 60°C", "0°C a 10°C", "-18°C a 4°C"], ans: 0 },
        { tip: "Los alimentos calientes deben mantenerse por encima de los 60°C en exhibición.", q: "En un buffet, ¿a qué temperatura mínima debe mantenerse la comida caliente?", options: ["A temperatura ambiente", "A 30°C", "Por encima de 60°C"], ans: 2 },
        { tip: "La temperatura ideal de un refrigerador comercial debe ser menor a 4°C.", q: "¿Cuál es la temperatura máxima segura para un refrigerador comercial?", options: ["10°C", "Menor a 4°C", "15°C"], ans: 1 },
        { tip: "El congelador debe operar a -18°C o menos para detener el crecimiento bacteriano.", q: "¿A qué temperatura debe estar un congelador?", options: ["0°C", "-5°C", "-18°C o menos"], ans: 2 },
        { tip: "No dejes comida cocinada a temperatura ambiente por más de 2 horas.", q: "¿Cuál es el tiempo MÁXIMO que una comida preparada puede estar a temperatura ambiente?", options: ["Todo el turno", "2 horas", "4 horas"], ans: 1 }
    ]},
    // NIVEL 4
    { powerName: "Jabón Purificador", powerId: 4, powerIcon: '🧴', pool: [
        { tip: "Método PEPS: Lo Primero que Entra al inventario es lo Primero que Sale.", q: "¿Qué significa el sistema de rotación PEPS?", options: ["Productos Especiales Para Servir", "Primero en Entrar, Primero en Salir", "Pocos Envases Por Separado"], ans: 1 },
        { tip: "En la nevera, las carnes crudas siempre van en las repisas inferiores para evitar goteos.", q: "¿Dónde se deben ubicar las carnes crudas dentro del refrigerador?", options: ["En la repisa superior", "En la puerta", "En las repisas inferiores"], ans: 2 },
        { tip: "Descongela los alimentos pasándolos al refrigerador 24h antes, nunca al clima.", q: "¿Cuál es el método más seguro para descongelar carne?", options: ["Bajo el sol", "En agua caliente", "Pasarla al refrigerador un día antes"], ans: 2 },
        { tip: "Las latas abolladas, oxidadas o infladas deben desecharse por riesgo de Botulismo.", q: "¿Qué debes hacer si encuentras una lata inflada o muy abollada?", options: ["Desecharla inmediatamente", "Hervirla antes de usar", "Usarla rápido"], ans: 0 },
        { tip: "Los alimentos secos deben almacenarse en estantes a mínimo 15cm del piso.", q: "Al almacenar bultos de harina, ¿cómo deben colocarse?", options: ["Directo en el piso", "Sobre estibas a 15cm del piso y paredes", "Apoyados contra la pared"], ans: 1 }
    ]}
];

/** ==========================================
 *  VARIABLES GLOBALES Y CONFIGURACIÓN
 *  ========================================== */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const EMOJI_FONT = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial, sans-serif';

let gameState = 'start'; 
let currentLevel = 0;
let lives = 3;
let keys = {};
let camera = { x: 0, y: 0 };
let worldWidth = 3000; 
let frameCount = 0;
let gameTimerInterval;
let timeLeft = 120;
let panicMode = false;
let activeKnowledge = [];

// MANEJO TECLADO GLOBAL (Atajos para Modales y Movimiento)
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    
    // Cierre o Avance Rápido (Cero Mouse)
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Escape') {
        if (gameState === 'paused') resumeGame();
        else if (gameState === 'gameover' || gameState === 'win') resetToMenu();
        else if (gameState === 'start' && !document.getElementById('instructions-menu').classList.contains('hidden')) hideInstructions();
        else if (gameState === 'start') startGame();
    }
    
    // Atajos Quiz Numéricos
    if (gameState === 'quiz') {
        if (e.code === 'Digit1' || e.code === 'Numpad1') checkAnswer(0, activeKnowledge[currentQIndex].ans);
        if (e.code === 'Digit2' || e.code === 'Numpad2') checkAnswer(1, activeKnowledge[currentQIndex].ans);
        if (e.code === 'Digit3' || e.code === 'Numpad3') checkAnswer(2, activeKnowledge[currentQIndex].ans);
    }
});
window.addEventListener('keyup', e => keys[e.code] = false);

// MANEJO TÁCTIL SENSIBLE Y SEGURO
function initMobileControls() {
    const addTouch = (id, code, isAction = false) => {
        const btn = document.getElementById(id);
        if(!btn) return;

        const press = (e) => {
            if(e.cancelable) e.preventDefault(); // Evita gestos raros del celular
            e.stopPropagation();
            keys[code] = true; 
            
            // Botón de salto funciona como ENTER universal
            if(isAction) {
                if(gameState === 'paused') resumeGame();
                else if(gameState === 'gameover' || gameState === 'win') resetToMenu();
                else if(!document.getElementById('instructions-menu').classList.contains('hidden')) hideInstructions();
                else if(!document.getElementById('main-menu').classList.contains('hidden')) startGame();
            }
        };

        const release = (e) => {
            if(e.cancelable) e.preventDefault();
            e.stopPropagation();
            keys[code] = false; 
        };

        btn.addEventListener('touchstart', press, { passive: false });
        btn.addEventListener('touchend', release, { passive: false });
        btn.addEventListener('touchcancel', release, { passive: false }); 
        
        // Soporte mouse para testeo en PC
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    };
    
    addTouch('btnLeft', 'ArrowLeft'); addTouch('btnRight', 'ArrowRight');
    addTouch('btnJump', 'ArrowUp', true); addTouch('btnShoot', 'KeyX');
}
initMobileControls();

function checkRectCollision(r1, r2) { 
    return !(r2.x >= r1.x + r1.w || r2.x + r2.w <= r1.x || r2.y >= r1.y + r1.h || r2.y + r2.h <= r1.y); 
}

/** ==========================================
 *  ENTIDADES DEL MOTOR GRÁFICO SEGURO
 *  ========================================== */
class Player {
    constructor() { this.w = 40; this.h = 40; this.powers = []; this.projectiles = []; this.reset(); }
    reset() {
        this.x = 100; this.y = 100; this.vx = 0; this.vy = 0;
        this.speed = 6; this.jumpForce = -15; this.grounded = false; this.jumps = 1;
        this.invulnerable = 0; this.facingRight = true; this.walkTimer = 0;
        this.platformVx = 0; this.applyPowers();
    }
    addPower(powerId) { if(!this.powers.includes(powerId)) this.powers.push(powerId); this.applyPowers(); }
    applyPowers() { this.speed = this.powers.includes(2) ? 10.5 : 6; }
    update() {
        let inputVx = 0;
        if(keys['ArrowLeft'] || keys['KeyA']) { inputVx = -this.speed; this.facingRight = false; this.walkTimer += 0.2; }
        else if(keys['ArrowRight'] || keys['KeyD']) { inputVx = this.speed; this.facingRight = true; this.walkTimer += 0.2; }
        else { this.walkTimer = 0; }

        this.vx = inputVx + (this.grounded ? this.platformVx : 0);
        this.x += this.vx;
        
        let hitboxX = {x: this.x, y: this.y + 4, w: this.w, h: this.h - 8};
        platforms.forEach(p => {
            if(checkRectCollision(hitboxX, p)) {
                if(this.vx > 0) this.x = p.x - this.w; else if(this.vx < 0) this.x = p.x + p.w;
            }
        });

        let maxJumps = this.powers.includes(1) ? 2 : 1;
        if((keys['ArrowUp'] || keys['KeyW']) && this.jumps > 0) {
            this.vy = this.jumpForce; this.grounded = false; this.jumps--; this.platformVx = 0;
            sfx.jump(); keys['ArrowUp'] = false; keys['KeyW'] = false; 
        }

        this.vy += 0.8; this.y += this.vy; this.grounded = false; this.platformVx = 0;
        let hitboxY = {x: this.x, y: this.y, w: this.w, h: this.h};
        platforms.forEach(p => {
            if(checkRectCollision(hitboxY, p)) {
                if(this.vy > 0) { this.y = p.y - this.h; this.vy = 0; this.grounded = true; this.jumps = maxJumps; this.platformVx = p.vx || 0; } 
                else if (this.vy < 0) { this.y = p.y + p.h; this.vy = 0; } 
            }
        });

        if(keys['KeyX'] && this.powers.includes(4)) {
            if(this.projectiles.length < 4) {
                let dir = this.facingRight ? 15 : -15;
                this.projectiles.push({x: this.x + 20, y: this.y + 20, vx: dir, active: true});
                sfx.shoot();
            }
            keys['KeyX'] = false;
        }
        if(this.invulnerable > 0) this.invulnerable--;
    }
    draw(ctx) {
        if(this.powers.includes(3) && this.invulnerable === 0) { 
            ctx.fillStyle = 'rgba(0, 229, 255, 0.4)'; ctx.beginPath(); ctx.arc(this.x + 20, this.y + 20, 35, 0, Math.PI*2); ctx.fill();
        }
        
        this.projectiles = this.projectiles.filter(p => p.active);
        ctx.fillStyle = '#FFF'; ctx.strokeStyle = '#00BCD4'; ctx.lineWidth = 3;
        this.projectiles.forEach(p => { p.x += p.vx; ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI*2); ctx.fill(); ctx.stroke(); });

        if (this.invulnerable > 0 && Math.floor(Date.now() / 100) % 2 !== 0) return;

        ctx.save(); 
        ctx.translate(this.x + this.w/2, this.y + this.h/2);
        if (this.grounded && this.vx !== 0 && this.vx !== this.platformVx) {
            ctx.rotate(Math.sin(this.walkTimer) * 0.2); ctx.translate(0, Math.abs(Math.sin(this.walkTimer)) * -5);
        } else if (!this.grounded) { ctx.translate(0, -5); }
        if(!this.facingRight) ctx.scale(-1, 1);
        
        // Base Geométrica Segura (Por si fallan emojis)
        ctx.fillStyle = '#2196F3'; ctx.beginPath(); ctx.arc(0, 0, this.w/2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = '28px ' + EMOJI_FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText('👨‍🍳', 0, 0); 
        ctx.restore();
    }
}

class Platform {
    constructor(x, y, w, h, vx=0) { this.startX = x; this.x = x; this.y = y; this.w = w; this.h = h; this.baseVx = vx; this.vx = vx; }
    update() { 
        this.vx = panicMode ? this.baseVx * 1.5 : this.baseVx;
        if(this.vx !== 0) { this.x += this.vx; if(Math.abs(this.x - this.startX) > 150) this.baseVx *= -1; } 
    }
    draw(ctx) { 
        let theme = levelThemes[currentLevel] || levelThemes[0];
        ctx.fillStyle = theme.plat1; ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = theme.plat2; ctx.fillRect(this.x, this.y, this.w, 15);
        if (this.vx !== 0) { ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x + 10, this.y + 5, 20, 5); ctx.fillRect(this.x + this.w - 30, this.y + 5, 20, 5); }
    }
}

class AcidPool {
    constructor(x, y, w) { this.x = x; this.y = y; this.w = w; this.h = 40; this.animTimer = 0; }
    draw(ctx) {
        this.animTimer += panicMode ? 0.2 : 0.1; 
        ctx.fillStyle = panicMode ? '#FF1744' : '#76ff03'; ctx.fillRect(this.x, this.y + 10, this.w, this.h - 10);
        ctx.fillStyle = panicMode ? '#FF8A80' : '#b2ff59';
        for(let i=10; i<this.w; i+=30) {
            let by = this.y + 10 + Math.sin(this.animTimer + i)*10;
            ctx.beginPath(); ctx.arc(this.x + i, by, 5, 0, Math.PI*2); ctx.fill();
        }
    }
}

class SawBlade {
    constructor(x, y, range, speed) { this.startX = x; this.x = x; this.y = y; this.w = 40; this.h = 40; this.range = range; this.baseSpeed = speed; this.dir = 1; this.angle = 0; }
    update() { 
        let s = panicMode ? this.baseSpeed * 1.5 : this.baseSpeed;
        this.x += s * this.dir; this.angle += (panicMode ? 0.4 : 0.2) * this.dir; 
        if(Math.abs(this.x - this.startX) > this.range) this.dir *= -1; 
    }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x + this.w/2, this.y + this.h/2); ctx.rotate(this.angle);
        ctx.fillStyle = '#9E9E9E'; ctx.beginPath(); ctx.arc(0, 0, this.w/2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = '28px ' + EMOJI_FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText('⚙️', 0, 0); 
        ctx.restore();
    }
}

class EnemyWalker {
    constructor(x, y, range, speed) { this.startX = x; this.x = x; this.y = y; this.w = 35; this.h = 35; this.range = range; this.baseSpeed = speed; this.dir = 1; this.animTimer = Math.random()*10; this.active = true; }
    update() { 
        let s = panicMode ? this.baseSpeed * 1.5 : this.baseSpeed;
        this.x += s * this.dir; if(Math.abs(this.x - this.startX) > this.range) this.dir *= -1; 
    }
    draw(ctx) {
        this.animTimer += panicMode ? 0.25 : 0.15; ctx.save(); ctx.translate(this.x + this.w/2, this.y + this.h/2);
        ctx.rotate(Math.sin(this.animTimer) * 0.3); 
        ctx.fillStyle = '#F44336'; ctx.beginPath(); ctx.arc(0, 0, this.w/2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = '24px ' + EMOJI_FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText('🦠', 0, 0); 
        ctx.restore();
    }
}

class EnemyFlyer {
    constructor(x, y, speedY) { this.x = x; this.y = y; this.w = 30; this.h = 30; this.baseVy = speedY; this.active = true; this.animTimer = 0; }
    update() {
        let s = panicMode ? this.baseVy * 1.5 : this.baseVy;
        this.y += s; this.x += Math.sin(this.y * 0.05) * 3;
        if(this.y > 600) this.active = false;
    }
    draw(ctx) {
        this.animTimer += panicMode ? 0.4 : 0.2; ctx.save(); ctx.translate(this.x + this.w/2, this.y + this.h/2);
        ctx.rotate(Math.sin(this.animTimer) * 0.5);
        ctx.fillStyle = '#FF9800'; ctx.beginPath(); ctx.arc(0, 0, this.w/2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = '20px ' + EMOJI_FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText('🪰', 0, 0); 
        ctx.restore();
    }
}

class EnemyShooter {
    constructor(x, y) { this.x = x; this.y = y; this.w = 40; this.h = 40; this.active = true; this.shootTimer = 0; this.animTimer = Math.random()*10; }
    update() {
        if(Math.abs(player.x - this.x) < 700) {
            this.shootTimer++; let limit = panicMode ? 50 : 80;
            if(this.shootTimer > limit) { 
                let dx = player.x < this.x ? -8 : 8;
                enemyProjectiles.push({x: this.x + 20, y: this.y + 10, vx: panicMode ? dx*1.3 : dx, vy: -2, type: 'spore'});
                sfx.enemyShoot(); this.shootTimer = 0;
            }
        }
    }
    draw(ctx) {
        this.animTimer += panicMode ? 0.2 : 0.1; ctx.save(); ctx.translate(this.x + this.w/2, this.y + this.h/2);
        let scale = 1 + Math.sin(this.animTimer)*0.08; ctx.scale(scale, 1/scale);
        ctx.fillStyle = '#9C27B0'; ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
        ctx.fillStyle = '#FFFFFF'; ctx.font = '28px ' + EMOJI_FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText('🍄', 0, 0); 
        ctx.restore();
    }
}

class Boss {
    constructor(x) { this.x = x; this.y = 100; this.w = 150; this.h = 150; this.hp = 70; this.vy = 4; this.animTimer = 0; this.shootTimer = 0; }
    update() {
        let v = panicMode ? this.vy * 1.5 : this.vy;
        this.y += v; if(this.y < 50 || this.y > 250) this.vy *= -1;
        this.shootTimer++; let limit = panicMode ? 40 : 70;
        if(this.shootTimer > limit) {
            sfx.enemyShoot();
            let pVx = panicMode ? -14 : -10;
            enemyProjectiles.push({x: this.x, y: this.y + 75, vx: pVx, vy: -3, type: 'toxin'});
            enemyProjectiles.push({x: this.x, y: this.y + 75, vx: pVx, vy: 0, type: 'toxin'});
            enemyProjectiles.push({x: this.x, y: this.y + 75, vx: pVx, vy: 3, type: 'toxin'});
            this.shootTimer = 0;
        }
    }
    draw(ctx) {
        this.animTimer += panicMode ? 0.2 : 0.1; ctx.save(); ctx.translate(this.x + this.w/2, this.y + this.h/2);
        let scale = 1 + Math.sin(this.animTimer)*0.05; ctx.scale(scale, scale);
        ctx.fillStyle = '#880E4F'; ctx.beginPath(); ctx.arc(0, 0, this.w/2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = '100px ' + EMOJI_FONT; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText('🦠', 0, 0); 
        ctx.restore();
        ctx.fillStyle = '#000'; ctx.fillRect(this.x, this.y - 30, 150, 15);
        ctx.fillStyle = '#E91E63'; ctx.fillRect(this.x, this.y - 30, (this.hp/70)*150, 15);
    }
}

class PowerItem {
    constructor(x, y, data) { this.x = x; this.y = y; this.w = 35; this.h = 35; this.data = data; this.active = true; this.bounce = 0; }
    draw(ctx) {
        if(!this.active) return;
        this.bounce += 0.1; ctx.save(); ctx.translate(this.x + this.w/2, this.y + this.h/2 + Math.sin(this.bounce)*5);
        ctx.fillStyle = 'rgba(255, 235, 59, 0.5)'; ctx.beginPath(); ctx.arc(0, 0, 25, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000000'; ctx.font = 'bold 24px Arial, sans-serif'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(this.data.powerIcon, 0, 0); 
        ctx.restore();
    }
}

class InfoBlock {
    constructor(x, y, tipText) { this.x = x; this.y = y; this.w = 40; this.h = 40; this.tipText = tipText; this.hit = false; this.bounceY = 0; }
    draw(ctx) {
        if(this.bounceY > 0) this.bounceY -= 1;
        ctx.save(); ctx.translate(this.x, this.y - this.bounceY);
        ctx.fillStyle = this.hit ? '#9E9E9E' : '#FF9800'; ctx.fillRect(0, 0, this.w, this.h);
        ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 28px Arial, sans-serif'; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(this.hit ? '✓' : '?', this.w/2, this.h/2);
        ctx.restore();
    }
}

// Variables Globales y Estado
let player = new Player(); 
let platforms = []; let obstacles = []; let infoBlocks = []; let enemies = []; let enemyProjectiles = []; let powerItem = null; let boss = null;
let door = {x: 0, y: 0, w: 60, h: 80};

// COLORES POR NIVEL (Para asegurar que cambian visualmente)
const levelThemes = [
    { bg: '#1a1a2e', grid: 'rgba(0, 188, 212, 0.1)', plat1: '#2c3e50', plat2: '#34495e' }, // L1: Normal
    { bg: '#001f3f', grid: 'rgba(0, 255, 255, 0.1)', plat1: '#0074D9', plat2: '#39CCCC' }, // L2: Frío
    { bg: '#3e2723', grid: 'rgba(255, 152, 0, 0.1)', plat1: '#5d4037', plat2: '#8d6e63' }, // L3: Madera
    { bg: '#2b0000', grid: 'rgba(255, 0, 0, 0.1)', plat1: '#4a0000', plat2: '#7f0000' },   // L4: Horno
    { bg: '#1a0033', grid: 'rgba(200, 0, 255, 0.1)', plat1: '#311b92', plat2: '#512da8' }   // L5: Jefe
];

// ARQUITECTURA FIJA (Garantiza Layout estable)
const levelLayouts = [
    { w: 2500, build: () => {
        platforms.push(new Platform(0, 500, 2500, 100));
        platforms.push(new Platform(400, 380, 150, 20));
        platforms.push(new Platform(800, 320, 200, 20));
        platforms.push(new Platform(1400, 400, 150, 20));
        platforms.push(new Platform(1900, 300, 200, 20));
        enemies.push(new EnemyWalker(600, 465, 100, 2));
        enemies.push(new EnemyWalker(1200, 465, 100, 2));
        enemies.push(new EnemyWalker(1800, 465, 100, 2));
        infoBlocks.push(new InfoBlock(500, 250, activeKnowledge[0].tip)); 
        infoBlocks.push(new InfoBlock(1000, 200, activeKnowledge[1].tip));
        infoBlocks.push(new InfoBlock(1600, 250, activeKnowledge[2].tip));
        if(!player.powers.includes(knowledgeBank[0].powerId)) powerItem = new PowerItem(200, 400, knowledgeBank[0]);
    }},
    { w: 3500, build: () => {
        platforms.push(new Platform(0, 500, 800, 100)); obstacles.push(new AcidPool(800, 550, 200));
        platforms.push(new Platform(1000, 500, 1000, 100)); obstacles.push(new AcidPool(2000, 550, 300));
        platforms.push(new Platform(2300, 500, 1200, 100));
        platforms.push(new Platform(700, 350, 200, 20, 2)); platforms.push(new Platform(1500, 380, 150, 20)); platforms.push(new Platform(2100, 320, 200, 20, 3));
        enemies.push(new EnemyWalker(500, 465, 100, 2.5)); enemies.push(new EnemyShooter(1300, 460)); enemies.push(new EnemyWalker(1600, 465, 150, 3)); enemies.push(new EnemyShooter(2600, 460));
        infoBlocks.push(new InfoBlock(600, 250, activeKnowledge[0].tip)); infoBlocks.push(new InfoBlock(1800, 250, activeKnowledge[1].tip)); infoBlocks.push(new InfoBlock(2800, 250, activeKnowledge[2].tip));
        if(!player.powers.includes(knowledgeBank[1].powerId)) powerItem = new PowerItem(300, 400, knowledgeBank[1]);
    }},
    { w: 5000, build: () => {
        platforms.push(new Platform(0, 500, 600, 100)); obstacles.push(new AcidPool(600, 550, 300));
        platforms.push(new Platform(900, 500, 1200, 100)); obstacles.push(new AcidPool(2100, 550, 400));
        platforms.push(new Platform(2500, 500, 1500, 100)); obstacles.push(new AcidPool(4000, 550, 300));
        platforms.push(new Platform(4300, 500, 700, 100));
        platforms.push(new Platform(650, 350, 150, 20, 2)); platforms.push(new Platform(2200, 300, 150, 20, 3));
        platforms.push(new Platform(3400, 380, 200, 20)); platforms.push(new Platform(4100, 350, 150, 20, 2.5));
        obstacles.push(new SawBlade(1300, 460, 150, 3)); obstacles.push(new SawBlade(3000, 460, 200, 4));
        enemies.push(new EnemyShooter(400, 460)); enemies.push(new EnemyWalker(1600, 465, 100, 3)); enemies.push(new EnemyShooter(2800, 460));
        enemies.push(new EnemyWalker(3500, 465, 150, 3.5)); enemies.push(new EnemyShooter(4500, 460));
        infoBlocks.push(new InfoBlock(1000, 250, activeKnowledge[0].tip)); infoBlocks.push(new InfoBlock(2600, 250, activeKnowledge[1].tip)); infoBlocks.push(new InfoBlock(3800, 250, activeKnowledge[2].tip));
        if(!player.powers.includes(knowledgeBank[2].powerId)) powerItem = new PowerItem(200, 400, knowledgeBank[2]);
    }},
    { w: 6500, build: () => {
        platforms.push(new Platform(0, 500, 800, 100)); obstacles.push(new AcidPool(800, 550, 400));
        platforms.push(new Platform(1200, 500, 1000, 100)); obstacles.push(new AcidPool(2200, 550, 500));
        platforms.push(new Platform(2700, 500, 1300, 100)); obstacles.push(new AcidPool(4000, 550, 600));
        platforms.push(new Platform(4600, 500, 1900, 100));
        platforms.push(new Platform(900, 350, 150, 20, 3)); platforms.push(new Platform(2300, 320, 150, 20, 4)); platforms.push(new Platform(4200, 350, 200, 20, 3.5));
        obstacles.push(new SawBlade(1600, 460, 200, 4)); obstacles.push(new SawBlade(3200, 460, 300, 5)); obstacles.push(new SawBlade(5200, 460, 400, 6));
        enemies.push(new EnemyShooter(600, 460)); enemies.push(new EnemyWalker(1800, 465, 200, 4)); enemies.push(new EnemyShooter(3600, 460));
        enemies.push(new EnemyWalker(4800, 465, 150, 4)); enemies.push(new EnemyShooter(5800, 460));
        infoBlocks.push(new InfoBlock(1400, 250, activeKnowledge[0].tip)); infoBlocks.push(new InfoBlock(3000, 250, activeKnowledge[1].tip)); infoBlocks.push(new InfoBlock(5000, 250, activeKnowledge[2].tip));
        if(!player.powers.includes(knowledgeBank[3].powerId)) powerItem = new PowerItem(300, 400, knowledgeBank[3]);
    }},
    { w: 1200, build: () => {
        platforms.push(new Platform(0, 500, 1200, 100)); 
        platforms.push(new Platform(150, 380, 200, 20, 2.5)); 
        platforms.push(new Platform(650, 300, 150, 20, -2.5));
        if(!player.powers.includes(4)) powerItem = new PowerItem(200, 250, {powerName: "Jabón Purificador", powerId: 4, powerIcon: '🧴'});
        boss = new Boss(900); 
    }}
];

function initLevel() {
    frameCount = 0;
    worldWidth = levelLayouts[currentLevel].w;
    
    // ASIGNAR PREGUNTAS ALEATORIAS PERO FIJAS PARA ESTE INTENTO
    if(currentLevel < 4) {
        let poolSize = knowledgeBank[currentLevel].pool.length;
        let shuffled = Array.from({length: poolSize}, (_, i) => i).sort(() => Math.random() - 0.5);
        activeKnowledge = [
            knowledgeBank[currentLevel].pool[shuffled[0]],
            knowledgeBank[currentLevel].pool[shuffled[1]],
            knowledgeBank[currentLevel].pool[shuffled[2]]
        ];
    } else {
        activeKnowledge = [];
    }

    platforms = []; obstacles = []; infoBlocks = []; enemies = []; enemyProjectiles = []; boss = null; powerItem = null;
    
    // Construye el nivel (Sin Math.random para evitar escenarios imposibles en reintentos)
    levelLayouts[currentLevel].build();
    door = {x: worldWidth - 200, y: 420, w: 60, h: 80};

    player.reset(); 
    document.getElementById('hud-level').innerText = currentLevel < 4 ? currentLevel + 1 : "JEFE"; 
    updateHUDPowerIcons();
    
    // Cambiar color base del juego
    let theme = levelThemes[currentLevel];
    document.getElementById('game-area').style.backgroundColor = theme.bg;

    startTimer();
}

function updateHUDPowerIcons() {
    let icons = player.powers.map(id => { let p = knowledgeBank.find(d => d.powerId === id); return p ? p.powerIcon : ''; }).join(' ');
    document.getElementById('hud-power').innerText = icons || "Ninguno";
}

function startTimer() {
    clearInterval(gameTimerInterval);
    timeLeft = 120; panicMode = false;
    document.getElementById('timer-container').classList.remove('panic'); document.getElementById('game-area').classList.remove('panic');
    updateTimerDisplay(); startMusic(false);

    gameTimerInterval = setInterval(() => {
        if (gameState === 'playing') {
            timeLeft--; updateTimerDisplay();
            if (timeLeft === 30 && !panicMode) {
                panicMode = true; document.getElementById('timer-container').classList.add('panic'); document.getElementById('game-area').classList.add('panic'); startMusic(true); 
            }
            if (timeLeft <= 0) { takeDamage(true, "¡EL TIEMPO SE AGOTÓ!"); }
        }
    }, 1000);
}

function updateTimerDisplay() {
    let m = Math.floor(Math.max(0, timeLeft) / 60).toString().padStart(2, '0');
    let s = (Math.max(0, timeLeft) % 60).toString().padStart(2, '0');
    document.getElementById('timer-container').innerText = `${m}:${s}`;
}

function updatePhysics() {
    platforms.forEach(p => p.update());
    player.update();
    
    camera.x = player.x - canvas.width / 3;
    if (camera.x < 0) camera.x = 0; if (camera.x > worldWidth - canvas.width) camera.x = worldWidth - canvas.width;

    // Generador de Moscas en niveles altos
    if (currentLevel >= 2 && frameCount % (180 - currentLevel*30) === 0) {
        if(Math.random() > 0.4) enemies.push(new EnemyFlyer(camera.x + Math.random()*canvas.width, -50, 2 + currentLevel));
    }

    if(powerItem && powerItem.active && checkRectCollision(player, powerItem)) {
        powerItem.active = false; player.addPower(powerItem.data.powerId); updateHUDPowerIcons(); sfx.powerup(); 
    }

    infoBlocks.forEach(b => {
        let blockHit = {x: b.x, y: b.y + b.h - 10, w: b.w, h: 10}; 
        if(!b.hit && checkRectCollision(player, blockHit) && player.vy < 0) {
            b.hit = true; b.bounceY = 15; player.vy = 0; sfx.coin(); 
            // TEXTO CORRECTO GARANTIZADO
            showInfo(b.tipText);
        }
    });

    obstacles.forEach(o => {
        if(o.update) o.update();
        let hitbox = {x: o.x + 10, y: o.y + 10, w: o.w - 20, h: o.h - 10};
        if(checkRectCollision(player, hitbox) && player.invulnerable === 0) takeDamage(true, "Caíste en un obstáculo mortal."); 
    });

    enemyProjectiles = enemyProjectiles.filter(p => p.y < 600 && p.x > camera.x - 200 && p.x < camera.x + 1200);
    enemyProjectiles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; 
        if(checkRectCollision(player, {x: p.x, y: p.y, w:15, h:15}) && player.invulnerable === 0) takeDamage(false);
    });

    enemies = enemies.filter(e => e.active);
    enemies.forEach(e => {
        e.update();
        if(checkRectCollision(player, e) && player.invulnerable === 0) takeDamage(false);
        player.projectiles.forEach(p => {
            if(p.active && checkRectCollision({x:p.x, y:p.y, w:10, h:10}, e)) { p.active = false; e.active = false; sfx.hit(); }
        });
    });

    if(boss) {
        boss.update();
        if(checkRectCollision(player, boss) && player.invulnerable === 0) takeDamage(false);
        player.projectiles.forEach(p => {
            if(p.active && checkRectCollision({x:p.x, y:p.y, w:10, h:10}, boss)) {
                p.active = false; boss.hp--; sfx.hit();
                if(boss.hp <= 0) { boss = null; door = {x: worldWidth - 200, y: 420, w: 60, h: 80}; sfx.door(); enemies = []; enemyProjectiles = []; }
            }
        });
    }

    if(checkRectCollision(player, door)) {
        let allBoxesRead = infoBlocks.length > 0 ? infoBlocks.every(b => b.hit) : true;
        if(!allBoxesRead && currentLevel < 4) {
            player.x = door.x - player.w - 30;
            player.vx = -8;
            player.vy = -4;
            sfx.hit();
            
            let penaltyText = "";
            if(player.powers.length > 0) {
                player.powers.pop();
                player.applyPowers();
                updateHUDPowerIcons();
                penaltyText = "<br><br><span style='color:#FF5252 !important; font-weight:bold;'>⚠️ SANCIÓN: ¡Has perdido un poder por no completar tu capacitación sanitaria!</span>";
            }
            
            showInfo("⚠️ ¡Capacitación Incompleta! No has tocado todas las cajas (?) de este nivel. Es obligatorio recibir toda la información antes de presentar la evaluación." + penaltyText);
        } else {
            sfx.door();
            if(currentLevel < 4) startQuiz();
            else showWin();
        }
    }

    if(player.y > canvas.height + 100) takeDamage(true, "Caíste al vacío."); 
    if(player.x < 0) player.x = 0; if(player.x + player.w > worldWidth) player.x = worldWidth - player.w;
    frameCount++;
}

function updateLivesDisplay() { document.getElementById('hud-lives').innerText = lives; }

function takeDamage(instantKill, msg = "Las ETAs te han atacado.") {
    if(player.powers.includes(3) && !instantKill && player.invulnerable === 0) { 
        player.invulnerable = 120; player.powers = player.powers.filter(id => id !== 3); updateHUDPowerIcons(); sfx.hit(); return;
    }
    sfx.hit(); lives--; updateLivesDisplay();
    if(lives <= 0 || (instantKill && lives <=0)) { 
        gameState = 'gameover'; document.getElementById('msgText').innerText = msg; document.getElementById('msgModal').classList.add('active'); 
    } else { player.x = 100; player.y = 100; player.vy = 0; player.invulnerable = 150; }
}

// --- UI Y FLUJO ---
window.startGame = function() {
    audioCtx.resume().then(() => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('hud').style.display = 'flex';
        document.getElementById('app-layout').classList.add('in-game'); 
        updateLivesDisplay(); gameState = 'playing'; player.powers = []; updateHUDPowerIcons(); initLevel(); 
    });
}

window.showInstructions = function() { document.getElementById('main-menu').classList.add('hidden'); document.getElementById('instructions-menu').classList.remove('hidden'); }
window.hideInstructions = function() { document.getElementById('instructions-menu').classList.add('hidden'); document.getElementById('main-menu').classList.remove('hidden'); }

window.resetToMenu = function() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.getElementById('hud').style.display = 'none';
    document.getElementById('app-layout').classList.remove('in-game');
    document.getElementById('main-menu').classList.remove('hidden');
    clearInterval(gameTimerInterval); currentLevel = 0; lives = 3; keys = {}; player.powers = [];
    gameState = 'start';
}

function showInfo(text) { gameState = 'paused'; document.getElementById('infoText').innerHTML = text; document.getElementById('infoModal').classList.add('active'); }
window.resumeGame = function() { document.getElementById('infoModal').classList.remove('active'); gameState = 'playing'; keys = {}; }

let currentQIndex = 0, score = 0;
function startQuiz() { gameState = 'quiz'; currentQIndex = 0; score = 0; renderQuiz(); document.getElementById('quizModal').classList.add('active'); }

function renderQuiz() {
    const container = document.getElementById('quizContainer'); container.innerHTML = '';
    const qData = activeKnowledge[currentQIndex];
    let html = `<div style="text-align:left;"><h3 style="color:#00BCD4 !important; border:none; padding:0; font-size:16px;">Pregunta ${currentQIndex + 1} de 3</h3><p style="font-size: 16px !important; margin: 5px 0;">${qData.q}</p>`;
    qData.options.forEach((opt, index) => { html += `<button class="option-btn" onclick="checkAnswer(${index}, ${qData.ans})"><span class="opt-num">[${index+1}]</span> ${opt}</button>`; });
    html += `</div>`; container.innerHTML = html;
}

window.checkAnswer = function(selected, correct) {
    if(selected === correct) { score++; sfx.coin(); } else { sfx.hit(); }
    currentQIndex++;
    if(currentQIndex < 3) { renderQuiz(); } 
    else {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        if(score === 3) { currentLevel++; initLevel(); gameState = 'playing'; } 
        else { alert("Fallaste el test. Repite el nivel y lee bien las cajas."); initLevel(); gameState = 'playing'; }
    }
}

function showWin() {
    gameState = 'win'; document.getElementById('msgTitle').innerText = "¡Master Chef! 🏆";
    document.getElementById('msgText').innerText = "Has asegurado la inocuidad alimentaria total.";
    document.getElementById('msgModal').classList.add('active'); clearInterval(gameTimerInterval);
}

// --- RENDERIZADO ---
function drawBackground() {
    let theme = levelThemes[currentLevel] || levelThemes[0];
    ctx.fillStyle = panicMode ? '#2B0000' : theme.bg; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save(); ctx.translate(-camera.x * 0.15, 0); 
    ctx.strokeStyle = panicMode ? 'rgba(255, 0, 0, 0.1)' : theme.grid; 
    ctx.lineWidth = 2;
    for(let i = 0; i < worldWidth + 1000; i+=100) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for(let i = 0; i < canvas.height; i+=100) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(worldWidth + 1000, i); ctx.stroke(); }
    
    ctx.fillStyle = panicMode ? 'rgba(255, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)';
    for(let i=200; i<worldWidth; i+=600) { ctx.beginPath(); ctx.arc(i, 200, 150, 0, Math.PI*2); ctx.fill(); }
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    ctx.save(); ctx.translate(-camera.x, 0); 

    obstacles.forEach(o => o.draw(ctx)); 
    platforms.forEach(p => p.draw(ctx));
    infoBlocks.forEach(b => b.draw(ctx));
    if(powerItem) powerItem.draw(ctx);
    enemies.forEach(e => e.draw(ctx));
    enemyProjectiles.forEach(p => {
        ctx.fillStyle = p.type === 'spore' ? '#C6FF00' : '#E91E63'; ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.stroke();
    });
    if(boss) boss.draw(ctx);
    
    // PUERTA SEGURA
    if (door.x > 0) { 
        ctx.fillStyle = '#795548'; ctx.fillRect(door.x, door.y, door.w, door.h);
        ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(door.x + door.w - 10, door.y + door.h/2, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = '40px ' + EMOJI_FONT; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText('🚪', door.x + door.w/2, door.y + door.h/2); 
    }

    if (gameState !== 'start') player.draw(ctx);
    ctx.restore();
}

function gameLoop() {
    if(gameState === 'playing') { updatePhysics(); } 
    else if (gameState === 'start') { camera.x += 1.5; if (camera.x > 2500 - canvas.width) camera.x = 0; }
    draw(); requestAnimationFrame(gameLoop);
}

// Inicializar el background (pero sin resetear vidas)
currentLevel = 0; 
worldWidth = 2500; 
gameLoop(); 
startMusic(false);
