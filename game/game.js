/* ============================================================
   GAME.JS — MOLECULE MAYHEM (Level 2: Physics Calibrated)
   ============================================================ */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// --- GLOBAL STATE ---
let gameActive = false;
let currentLevel = 0;
let startTime = 0;
let elapsedSeconds = 0;
let timerValue = "00:00";
let playerName = "Pemain";
let activeMolecule = "Fe";
let particles = [];
let shakeAmount = 0;
let collectedAtoms = [];

let player = {
  x: 50, y: 480, w: 25, h: 45,
  vx: 0, vy: 0, speed: 4, jump: -13,
  grounded: false, stun: 0, walkCycle: 0, blastTimer: 0, ignorePlatforms: 0
};

// --- LEVEL DATA ---
//level1
const levels = [
  {
    name: "The Iron Tower",
    molecule: "Fe",
    start: { x: 50, y: 530 },
    platforms: [
      { x: 0, y: 580, w: 220, h: 50, type: 'stone' }, //lantai satu kiri
      { x: 220, y: 580, w: 330, h: 50, type: 'water', label: 'H2O' }, //air
      { x: 550, y: 580, w: 250, h: 50, type: 'stone' },//lantai 1 kanan

      { x: 100, y: 490, w: 80, h: 15, type: 'wood' },   // Tangga 1 (90px dari Dasar)
      { x: 220, y: 420, w: 80, h: 15, type: 'wood' },   // Tangga 2 (70px antar Wood)

      { x: 640, y: 490, w: 80, h: 15, type: 'wood' },   // Rescue Step Kanan //kanan
      { x: 500, y: 420, w: 80, h: 15, type: 'wood' },   // Rescue Step Kanan //kiri

      { x: 0, y: 330, w: 220, h: 20, type: 'stone' },   // [LANTAI 2] Kiri (90px dari Wood)
      { x: 320, y: 330, w: 120, h: 20, type: 'wood' },  // [LANTAI 2] Jembatan
      { x: 550, y: 330, w: 250, h: 20, type: 'stone' }, // [LANTAI 2] Kanan

      { x: 100, y: 240, w: 80, h: 15, type: 'wood' },   // Tangga 3 (90px dari Lantai 2)
      { x: 220, y: 170, w: 80, h: 15, type: 'wood' },   // Tangga 4 (70px antar Wood)

      { x: 350, y: 80, w: 450, h: 20, type: 'stone' },  // [LANTAI 3] Puncak (90px dari Wood)
    ],
    obstacles: [
      { x: 130, y: 450, w: 20, h: 30, type: 'Cu', label: 'Cu', destroyed: false },
      { x: 250, y: 380, w: 20, h: 30, type: 'Cu', label: 'Cu', destroyed: false },
      { x: 740, y: 290, w: 20, h: 30, type: 'Cu', label: 'Cu', destroyed: false },
      { x: 340, y: 290, w: 20, h: 30, type: 'Cu', label: 'Cu', destroyed: false },
      { x: 740, y: 290, w: 20, h: 30, type: 'Cu', label: 'Cu', destroyed: false }
    ],
    lever: { x: 740, y: 560, active: false },
    gate: { x: 500, y: 20, w: 30, h: 60, destroyed: false },
    exit: { x: 740, y: 30, w: 40, h: 50 }
  },
  //level2
  {
    name: "The Chamber of Gases",
    molecule: "CH4",
    inventory: ["CH4", "SF6"],
    start: { x: 50, y: 530 },
    platforms: [
      { x: 0, y: 580, w: 430, h: 50, type: 'stone' },
      { x: 430, y: 580, w: 330, h: 50, type: 'poison', label: 'ACID' },
      { x: 760, y: 580, w: 40, h: 50, type: 'stone' },
      { x: 150, y: 490, w: 80, h: 15, type: 'wood' },   // Tangga 1 (90px dari Dasar)
      { x: 270, y: 420, w: 80, h: 15, type: 'wood' },   // Tangga 2 (70px antar Wood)
      { x: 430, y: 330, w: 800, h: 20, type: 'stone' }, // [LANTAI 2] (90px dari Wood)

      { x: 260, y: 170, w: 80, h: 15, type: 'wood' },   // Tangga 4 (Lanjutan naik)
      { x: 540, y: 130, w: 50, h: 15, type: 'iron', label: 'Fe' },   // [TANGGA 5] Penyangga Besi

      { x: 350, y: 80, w: 190, h: 20, type: 'stone' },  // [LANTAI 3] Kiri (90px dari Wood)
      { x: 590, y: 80, w: 210, h: 20, type: 'stone' },  // [LANTAI 3] Kanan
    ],
    fans: [{ x: 0, y: 330, w: 800, h: 90, force: 0.7 }],
    obstacles: [],
    boxes: [
      { x: 400, y: 30, w: 50, h: 50, vx: 0, vy: 0, label: 'KOTAK' } // Kotak Metal
    ],
    exit: { x: 740, y: 30, w: 40, h: 50 }
  },
  //level 3
  {
    name: "The Corrosive Factory",
    molecule: "HCl",
    inventory: ["HCl", "NH3"],
    start: { x: 50, y: 530 },
    platforms: [
      // =========================
      // LANTAI 1
      // =========================
      { x: 0, y: 580, w: 800, h: 50, type: 'stone' },

      // =========================
      // LANTAI 2 (RAPAT TOTAL - SELANG SELING)
      // =========================
      { x: 0, y: 510, w: 200, h: 20, type: 'stone' },
      { x: 200, y: 510, w: 100, h: 20, type: 'NaOH', label: 'NaOH' },
      { x: 300, y: 510, w: 200, h: 20, type: 'stone' },
      { x: 500, y: 510, w: 100, h: 20, type: 'iron', label: 'Fe' },
      { x: 600, y: 510, w: 200, h: 20, type: 'stone' },

      // =========================
      // WOOD DI ATAS LANTAI 2
      // =========================
      { x: 130, y: 430, w: 80, h: 15, type: 'wood' },
      { x: 20, y: 360, w: 80, h: 15, type: 'wood' },

      // =========================
      // LANTAI 3 (RAPAT TOTAL - MULAI DARI X:180)
      // =========================
      { x: 0, y: 80, w: 80, h: 15, type: 'wood' }, // PLATFORM EXIT SEBELAH KIRI
      { x: 180, y: 260, w: 620, h: 20, type: 'stone' },
      { x: 600, y: 160, w: 80, h: 15, type: 'wood' },
      { x: 720, y: 80, w: 80, h: 15, type: 'wood' }
    ],
    fans: [],
    obstacles: [
      { x: 0, y: 160, w: 800, h: 100, type: 'nox_pollution', label: 'POLUSI NOx' }
    ],
    obstacles2: [
      // Pilar CaCO3 (Solid + Teleport)
      { x: 780, y: 0, w: 20, h: 80, type: 'limestone', label: 'CaCO3' }
    ],
    boxes: [],
    exit: { x: 0, y: 30, w: 40, h: 50 }
  },
  //level 4
  {
    name: "The Synthesis Maze",
    molecule: "Stickman",
    inventory: [],
    start: { x: 50, y: 530 },
    platforms: [
      // LANTAI 1 (DASAR)
      { x: 0, y: 580, w: 800, h: 50, type: 'stone' },

      // LANTAI 2 (3 SEGMEN, 2 LUBANG LEBIH LEBAR)
      { x: 0, y: 490, w: 200, h: 20, type: 'stone' },
      { x: 300, y: 490, w: 200, h: 20, type: 'stone', label: 'C' },
      { x: 600, y: 490, w: 200, h: 20, type: 'stone' },

      // 5 BARIS WOOD BERJEJER (W: 40PX) - LABEL O-C-O-H-C
      { x: 50, y: 420, w: 40, h: 15, type: 'wood', label: 'O' },
      { x: 210, y: 420, w: 40, h: 15, type: 'wood', label: 'C' },
      { x: 370, y: 420, w: 40, h: 15, type: 'wood', label: 'O' },
      { x: 530, y: 420, w: 40, h: 15, type: 'wood', label: 'H' },
      { x: 690, y: 420, w: 40, h: 15, type: 'wood', label: 'C' },

      // LANTAI 3 (2 SEGMEN, BOLONG TENGAH) - LABEL C
      { x: 0, y: 330, w: 150, h: 20, type: 'stone', label: 'C' },
      { x: 650, y: 330, w: 150, h: 20, type: 'stone', label: 'C' },

      // LANTAI PUNCAK (API BERMULA DI X: 200 DENGAN W: 100)
      { x: 200, y: 240, w: 100, h: 20, type: 'fire', label: 'API' },
      { x: 300, y: 240, w: 200, h: 20, type: 'stone', label: 'LAND' },
      { x: 500, y: 240, w: 100, h: 20, type: 'fire', label: 'API' },

    ],
    fans: [],
    obstacles: [],
    obstacles2: [],
    items: [
      // Atom Melayang di Lubang Lantai 2 (H di kiri, O di kanan)
      { x: 250, y: 460, type: 'atom', label: 'H' },
      { x: 550, y: 460, type: 'atom', label: 'O' },

      // Molekul C di lantai 2 (Left, Middle, Right segments)
      { x: 100, y: 460, type: 'atom', label: 'C' },
      { x: 400, y: 460, type: 'atom', label: 'C' },
      { x: 700, y: 460, type: 'atom', label: 'C' },

      // Molekul O, C, O, H, C di atas wood platform berurutan
      { x: 70, y: 390, type: 'atom', label: 'O' },
      { x: 230, y: 390, type: 'atom', label: 'C' },
      { x: 390, y: 390, type: 'atom', label: 'O' },
      { x: 550, y: 390, type: 'atom', label: 'H' },
      { x: 710, y: 390, type: 'atom', label: 'C' },

      // Molekul C di Lantai 3 (Tengah-tengah platform kiri & kanan)
      { x: 75, y: 300, type: 'atom', label: 'C' },
      { x: 725, y: 300, type: 'atom', label: 'C' }
    ],
    exit: { x: 380, y: 190, w: 40, h: 50 },
    trashDevice: { x: 740, y: 550, w: 35, h: 30 }
  }
];

let curLvlData = null;

function loadLevel(idx, isTransition = false) {
  curLvlData = JSON.parse(JSON.stringify(levels[idx]));
  player.x = curLvlData.start.x;
  player.y = curLvlData.start.y;
  player.vx = 0; player.vy = 0;
  activeMolecule = curLvlData.molecule || (idx === 1 ? "CH4" : "Fe");
  gameActive = true;
  if (!isTransition) {
    startTime = Date.now();
    elapsedSeconds = 0;
  }

  // Clear Level 5 state
  collectedAtoms = [];
  player.drunkTimer = 0;

  const buttons = document.querySelectorAll('#levelSelector button');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
    if (i <= idx) btn.classList.remove('locked');
  });
}

function jumpToLevel(idx) {
  if (idx >= levels.length) return;
  const buttons = document.querySelectorAll('#levelSelector button');
  if (buttons[idx] && buttons[idx].classList.contains('locked')) {
    showToast("LEVEL TERKUNCI!", true);
    return;
  }
  currentLevel = idx;
  document.getElementById('gameOverlay').style.display = 'none';
  loadLevel(idx);
  if (!gameActive) requestAnimationFrame(gameLoop);
}

function unlockAllLevels() {
  const buttons = document.querySelectorAll('#levelSelector button');
  buttons.forEach(btn => {
    btn.classList.remove('locked');
  });
  showToast("DEV: SEMUA LEVEL TERBUKA!", false);
}

function initGame() {
  let nameInput = document.getElementById('playerNameInput');
  if (nameInput) {
    let nameVal = nameInput.value.trim();
    playerName = nameVal || "Pemain";
  } else {
    playerName = "Pemain";
  }
  document.getElementById('gameOverlay').style.display = 'none';
  currentLevel = 0;
  loadLevel(currentLevel);
  requestAnimationFrame(gameLoop);
}

document.getElementById('btnStart').addEventListener('click', initGame);

// --- UPDATE ---

function getCollectedFormulaString() {
  if (collectedAtoms.length === 0) return "";
  let counts = { C: 0, H: 0, O: 0 };
  collectedAtoms.forEach(a => { if (counts[a] !== undefined) counts[a]++; });

  let formula = "";
  // Chemistry order: Carbon, then Hydrogen, then Oxygen (Hill system)
  if (counts.C > 0) formula += "C" + (counts.C > 1 ? counts.C : "");
  if (counts.H > 0) formula += "H" + (counts.H > 1 ? counts.H : "");
  if (counts.O > 0) formula += "O" + (counts.O > 1 ? counts.O : "");
  return formula;
}

function checkSynthesisFormula() {
  let cCount = collectedAtoms.filter(x => x === 'C').length;
  let hCount = collectedAtoms.filter(x => x === 'H').length;
  let oCount = collectedAtoms.filter(x => x === 'O').length;

  if (cCount === 1 && hCount === 2 && oCount === 1) {
    // Exactly Formaldehida (CH2O)
    activeMolecule = "CH2O";
    showToast("SINTESIS: FORMALDEHIDA (CH2O) TERBENTUK!", true);
    spawnParticles(player.x + 12, player.y + 20, "#8e44ad", 25);
  } else if (hCount === 2 && oCount === 1 && cCount === 0) {
    // Exactly Water (H2O)
    activeMolecule = "H2O";
    showToast("SINTESIS BERHASIL: AIR (H2O)!", false);
    spawnParticles(player.x + 12, player.y + 20, "#00f6ff", 30);
  } else if (hCount === 2 && oCount === 2 && cCount === 0) {
    // Hydrogen Peroxide (H2O2)
    activeMolecule = "H2O2";
    showToast("SINTESIS: HIDROGEN PEROKSIDA (H2O2)!", true);
    spawnParticles(player.x + 12, player.y + 20, "#e74c3c", 25);
  } else {
    // Partial formula state (e.g. C2, CH, H2, O2, C2H2, etc.)
    let formula = getCollectedFormulaString();
    activeMolecule = formula || "Stickman";
  }
}

function update() {
  if (!gameActive) return;

  elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  let m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  let s = (elapsedSeconds % 60).toString().padStart(2, '0');
  timerValue = `${m}:${s}`;

  // RE-CALIBRATED PHYSICS
  let gravity = 0.8;
  if (activeMolecule === "CH4") { gravity = 0.5; player.jump = -13; }
  else if (activeMolecule === "SF6") { gravity = 0.8; player.jump = -13; }
  else if (activeMolecule === "NH3") { gravity = 0.8; player.jump = -13; }
  else if (activeMolecule === "HCl") { gravity = 0.8; player.jump = -13; }
  else if (activeMolecule === "He") { gravity = 0.2; player.jump = -13; } // Floating Helium
  else if (activeMolecule === "N2") { gravity = 1.5; player.jump = -13; } // Heavy Nitrogen
  else if (activeMolecule === "H2O") { gravity = 0.7; player.jump = -13; } // Air
  else if (activeMolecule === "CH2O") { gravity = 0.9; player.jump = -13; } // Formaldehida
  else { gravity = 0.8; player.jump = -13; }

  player.vy += gravity;

  // Drunk Timer Effect (Terhuyung-huyung & Reversed controls)
  if (player.drunkTimer > 0) {
    player.drunkTimer--;
    // Wobble horizontally slightly
    if (Math.random() < 0.15) {
      player.vx += (Math.random() - 0.5) * 3;
    }
    if (player.drunkTimer === 0) {
      activeMolecule = "Stickman";
      showToast("Efek Formaldehida Hilang!");
    }
  }

  // Wind logic
  if (curLvlData.fans) {
    curLvlData.fans.forEach(f => {
      if (player.x > f.x && player.x < f.x + f.w && player.y > f.y && player.y < f.y + f.h) {
        if (activeMolecule === "CH4") {
          if (player.y <= f.y + 70) {
            if (player.blastTimer <= 0) {
              player.blastTimer = 88;
              player.ignorePlatforms = 88;
              player.y = f.y + 70; // Snaps to exactly height 70px of wind zone
              if (!player.lastWindWarn || Date.now() - player.lastWindWarn > 2000) {
                startTime -= 5000;
                spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#2ecc71', 15);
                showToast("TERTIUP ANGIN: Gas Metana (CH₄) Ringan Terbawa Angin Kencang ke Kanan! Jatuh ke Asam!", true);
                player.lastWindWarn = Date.now();
              }
            }
          }
        } else if (activeMolecule === "SF6") {
          if (Math.random() < 0.1) {
            spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#9b59b6', 1);
          }
        } else {
          player.vx += f.force * 1.5;
        }
      }
    });
  }

  if (player.blastTimer > 0) {
    player.blastTimer--;
    if (currentLevel === 1) { // Level 2: CH4 wind blow to the right
      player.vx = 9;
      player.vy = 0.8; // Gradually drifts downward sloping as they go right
      if (Math.random() < 0.3) {
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#2ecc71', 3);
      }
    } else { // Level 3: HCl + Limestone (CaCO3) blast to the left
      player.vx = -9;
      player.vy = -0.5;
      if (Math.random() < 0.3) {
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#ffffff', 3);
      }
    }
  } else if (player.stun > 0) {
    player.stun--; player.vx = 0;
  }
  if (player.ignorePlatforms > 0) {
    player.ignorePlatforms--;
    if (player.blastTimer <= 0) {
      player.vx *= 0.96;
    }
  }
  player.x += player.vx;
  player.y += player.vy;
  player.grounded = false;

  // Synthesis Item Collection Loop
  if (curLvlData.items) {
    curLvlData.items.forEach(it => {
      // Cooldown timer to allow repeated pick-ups after respawning
      if (it.collected && it.respawnTimer > 0) {
        it.respawnTimer--;
        if (it.respawnTimer === 0) {
          it.collected = false;
        }
      }

      if (!it.collected && player.x < it.x + 15 && player.x + player.w > it.x - 15 &&
        player.y < it.y + 15 && player.y + player.h > it.y - 15) {
        it.collected = true;
        it.respawnTimer = 180; // 3 seconds respawn time
        collectedAtoms.push(it.label);
        spawnParticles(it.x, it.y, it.label === 'C' ? '#95a5a6' : (it.label === 'O' ? '#e74c3c' : '#ffffff'), 15);
        showToast("ATOM TERAMBIL: " + it.label);
        checkSynthesisFormula();
      }
    });
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  if (player.y < 0) {
    player.y = 0;
    if (player.vy < 0) player.vy = 0; // Solid ceiling constraint (kepentok!)
  }
  if (player.y > canvas.height) { loadLevel(currentLevel, true); showToast("WASTED!", true); }
  if (curLvlData.boxes) {
    curLvlData.boxes.forEach(box => {
      // Hanya gerakkan dan cek lantai jika belum terkunci
      if (!box.locked) {
        box.vy = (box.vy || 0) + 0.8;
        box.vx = (box.vx || 0) * 0.9;
        box.x += box.vx; box.y += box.vy;

        // Deteksi tabrakan box dengan platform
        curLvlData.platforms.forEach(p => {
          // Landing (Nginjek Lantai)
          if (box.x + 15 < p.x + p.w && box.x + box.w - 15 > p.x &&
            box.y + box.h > p.y && box.y + box.h < p.y + 20 && box.vy >= 0) {
            box.y = p.y - box.h; box.vy = 0;
            if (p.type === 'iron') {
              box.locked = true;
              showToast("KOTAK TERKUNCI PADA PENYANGGA BESI!");
            }
          }
          // Kejedot Lantai (Head Bump)
          if (box.x < p.x + p.w && box.x + box.w > p.x &&
            box.y < p.y + p.h && box.y > p.y + p.h - 15 && box.vy < 0) {
            box.y = p.y + p.h; box.vy = 0;
          }
        });
      }      // AABB Collision Resolution between Player and Box (berlaku baik locked maupun bebas)
      let boxMidX = box.x + box.w / 2;
      let boxMidY = box.y + box.h / 2;
      let plMidX = player.x + player.w / 2;
      let plMidY = player.y + player.h / 2;

      let dx = plMidX - boxMidX;
      let dy = plMidY - boxMidY;
      let halfW = (player.w + box.w) / 2;
      let halfH = (player.h + box.h) / 2;

      if (Math.abs(dx) < halfW && Math.abs(dy) < halfH) {
        let overlapX = halfW - Math.abs(dx);
        let overlapY = halfH - Math.abs(dy);

        if (overlapX < overlapY) {
          // Tabrakan Horizontal (Kiri/Kanan)
          if (dx > 0) {
            player.x += overlapX;
            if (activeMolecule === "SF6" && !box.locked) box.vx = -4;
          } else {
            player.x -= overlapX;
            if (activeMolecule === "SF6" && !box.locked) box.vx = 4;
          }
          player.vx = 0;
        } else {
          // Tabrakan Vertikal (Atas/Bawah)
          if (dy > 0) {
            // Kejedot dari bawah (Head Bump)
            player.y += overlapY;
            player.vy = 0;
          } else {
            // Mendarat di atas box (Landing)
            player.y -= overlapY;
            player.vy = 0;
            player.grounded = true;
          }
        }
      }
    });
  }

  // Collisions & Special Level 3 Reactions
  curLvlData.platforms.forEach((p, idx) => {
    // If ignorePlatforms is active, skip all collisions except the bottom floor at y: 580!
    if (player.ignorePlatforms > 0 && p.y !== 580) {
      return;
    }
    // Korosi Logam (HCl vs Iron)
    if (activeMolecule === "HCl" && p.type === 'iron') {
      if (player.x < p.x + p.w + 5 && player.x + player.w > p.x - 5 && player.y < p.y + p.h + 5 && player.y + player.h > p.y - 5) {
        p.w -= 1;
        if (p.w <= 0) { curLvlData.platforms.splice(idx, 1); showToast("REAKSI: Besi Larut!"); }
        spawnParticles(player.x + 10, player.y + 10, "#ffffff", 2);
      }
    }

    // NaOH Platform Reaction (Acid-Base Neutralization)
    if (p.type === 'NaOH') {
      if (player.x < p.x + p.w && player.x + player.w > p.x && player.y + player.h >= p.y - 4 && player.y + player.h <= p.y + 4 && player.vy >= 0) {
        if (activeMolecule === "HCl") {
          // Opposite reaction! Acid + Base -> Time runs extremely fast!
          startTime -= 50; // Waktu berjalan cepat per frame
          if (Math.random() < 0.2) {
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#f1c40f', 2);
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#ffffff', 2);
          }
          if (!player.lastNaOHWarn || Date.now() - player.lastNaOHWarn > 3000) {
            showToast("NETRALISASI ASAM-BASA: HCl + NaOH! Waktu berjalan cepat!", true);
            player.lastNaOHWarn = Date.now();
          }
        } else if (activeMolecule === "NH3") {
          // Both are bases! Safe!
          if (!player.lastNaOHWarn || Date.now() - player.lastNaOHWarn > 3000) {
            showToast("SESAMA BASA: NH₃ + NaOH! Tidak Bereaksi.", false);
            player.lastNaOHWarn = Date.now();
          }
        }
      }
    }

    // Special Fire Platform Reaction
    if (p.type === 'fire') {
      if (player.x < p.x + p.w && player.x + player.w > p.x && player.y + player.h >= p.y - 4 && player.y + player.h <= p.y + 4 && player.vy >= 0) {
        if (activeMolecule === "H2O") {
          // Safe! Walk over it. Spawn cool blue steam particles.
          if (Math.random() < 0.3) {
            spawnParticles(player.x + player.w / 2, player.y + player.h - 5, '#00f6ff', 2);
          }
        } else if (activeMolecule === "CH2O") {
          // Explode! Physical fall to bottom floor and suffer 10s penalty
          player.ignorePlatforms = 45; // Bypass intermediate platform collisions
          player.vy = 8; player.vx = 0;
          player.stun = 45; // Disable controls during fall
          startTime -= 10000; // 10s penalty
          shakeAmount = 15;
          showToast("LEDAKAN EKSPLOSIF: Formaldehida Terbakar Api! Jatuh ke Dasar & -10s!", true);
          spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#e74c3c', 40);
          spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#34495e', 20);
        } else {
          // Other molecules: Physical fall to bottom floor and suffer 5s penalty
          player.ignorePlatforms = 45; // Bypass intermediate platform collisions
          player.vy = 8; player.vx = 0;
          player.stun = 45; // Disable controls during fall
          startTime -= 5000; // 5s penalty
          shakeAmount = 8;
          showToast("TERBAKAR API: Jatuh ke Dasar & -5s!", true);
          spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#e67e22', 20);
        }
      }
    }

    // Special Water Platform Reaction (Fe + H2O -> Corrosion / Fast Time)
    if (p.type === 'water') {
      if (player.x < p.x + p.w && player.x + player.w > p.x && player.y + player.h >= p.y - 4 && player.y + player.h <= p.y + 4 && player.vy >= 0) {
        if (activeMolecule === "Fe") {
          startTime -= 40; // Waktu berjalan cepat (time penalty)
          if (Math.random() < 0.15) {
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#d35400', 3);
          }
          if (!player.lastWaterWarn || Date.now() - player.lastWaterWarn > 3000) {
            showToast("KOROSI: BESI BERKARAT! Waktu berjalan cepat!", true);
            player.lastWaterWarn = Date.now();
          }
        }
      }
    }

    // Special Poison/Acid Platform Reaction
    if (p.type === 'poison') {
      if (player.x < p.x + p.w && player.x + player.w > p.x && player.y + player.h >= p.y - 4 && player.y + player.h <= p.y + 4 && player.vy >= 0) {
        if (activeMolecule === "SF6") {
          if (Math.random() < 0.1) {
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#bdc3c7', 1);
          }
          if (!player.lastAcidWarn || Date.now() - player.lastAcidWarn > 3000) {
            showToast("SF6 REACTION: DENSE INERT GAS! Kebal Asam!", false);
            player.lastAcidWarn = Date.now();
          }
        } else if (activeMolecule === "CH4") {
          startTime -= 60; // Waktu berjalan cepat per frame
          shakeAmount = 6;
          if (Math.random() < 0.3) {
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#2ecc71', 3);
          }
          if (!player.lastAcidWarn || Date.now() - player.lastAcidWarn > 2000) {
            showToast("CH4 IN ACID: FLAMMABLE BURNING! Waktu berjalan cepat!", true);
            player.lastAcidWarn = Date.now();
          }
        } else if (activeMolecule === "HCl") {
          if (Math.random() < 0.1) {
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#e74c3c', 1);
          }
          if (!player.lastAcidWarn || Date.now() - player.lastAcidWarn > 3000) {
            showToast("HCl REACTION: ACID IMMUNITY!", false);
            player.lastAcidWarn = Date.now();
          }
        } else if (activeMolecule === "NH3") {
          // Opposite reaction! Base + Acid -> Time runs extremely fast!
          startTime -= 50; // Waktu berjalan cepat per frame
          if (Math.random() < 0.2) {
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#3498db', 2);
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#9b59b6', 2);
          }
          if (!player.lastAcidWarn || Date.now() - player.lastAcidWarn > 3000) {
            showToast("NETRALISASI ASAM-BASA: NH₃ + ASAM! Waktu berjalan cepat!", true);
            player.lastAcidWarn = Date.now();
          }
        } else {
          startTime -= 60; // Waktu berjalan cepat per frame
          shakeAmount = 5;
          if (Math.random() < 0.3) {
            spawnParticles(player.x + Math.random() * player.w, player.y + player.h - 5, '#9b59b6', 3);
          }
          if (!player.lastAcidWarn || Date.now() - player.lastAcidWarn > 2000) {
            showToast("TERPAPAR ASAM: KOROSI! Waktu berjalan cepat!", true);
            player.lastAcidWarn = Date.now();
          }
        }
      }
    }

    // Standard Solid Collision (Vertical)
    if (player.x < p.x + p.w && player.x + player.w > p.x && player.y + player.h > p.y && player.y + player.h < p.y + 20 && player.vy >= 0) {
      player.y = p.y - player.h; player.vy = 0; player.grounded = true;
    }
    if (player.x < p.x + p.w && player.x + player.w > p.x && player.y < p.y + p.h && player.y > p.y + p.h - 20 && player.vy < 0) {
      player.y = p.y + p.h; player.vy = 0;

      // Level 3 Head Bump Reactions
      if (p.type === 'NaOH') {
        if (activeMolecule === "HCl") {
          startTime -= 5000; // 5s penalty
          shakeAmount = 8;
          spawnParticles(player.x + player.w / 2, p.y + p.h, '#ffffff', 15);
          spawnParticles(player.x + player.w / 2, p.y + p.h, '#f1c40f', 10);
          showToast("REAKSI HCl + NaOH: NETRALISASI EKSOTERMIK! PENALTY +5s!", true);
        } else if (activeMolecule === "NH3") {
          spawnParticles(player.x + player.w / 2, p.y + p.h, '#3498db', 5);
          showToast("REAKSI NH3 + NaOH: KEDUA ZAT BASA! Tidak Bereaksi.", false);
        }
      } else if (p.type === 'iron') {
        if (activeMolecule === "HCl") {
          startTime -= 2000; // 2s penalty
          shakeAmount = 4;
          spawnParticles(player.x + player.w / 2, p.y + p.h, '#ffffff', 12);
          showToast("REAKSI HCl + Fe: KOROSI ASAM! Menghasilkan Gas H₂!", true);
        } else if (activeMolecule === "NH3") {
          showToast("REAKSI NH3 + Fe: AMONIA TIDAK BEREAKSI DENGAN BESI.", false);
        }
      }
    }
  });

  // Obstacles 2 (Solid + Reaction)
  if (curLvlData.obstacles2) {
    curLvlData.obstacles2.forEach(ob => {
      let obMidX = ob.x + ob.w / 2;
      let obMidY = ob.y + ob.h / 2;
      let plMidX = player.x + player.w / 2;
      let plMidY = player.y + player.h / 2;
      let dx = plMidX - obMidX;
      let dy = plMidY - obMidY;
      let width = (player.w + ob.w) / 2;
      let height = (player.h + ob.h) / 2;

      if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        // HCl reacts with CaCO3 (Limestone) to release carbon dioxide and launch player back!
        if (ob.type === 'limestone' && activeMolecule === "HCl") {
          player.blastTimer = 88; // Extended to 88 frames at vx = -9 to make the slide cinematic and readable!
          spawnParticles(player.x, player.y, "#ffffff", 40);
          spawnParticles(player.x, player.y, "#bdc3c7", 15);
          shakeAmount = 10;
          showToast("REAKSI HCl + CaCO₃: PELEPASAN GAS CO₂! Terhempas ke Finish!", false);
          return;
        }
        // Solid Collision Logic for Obstacles2
        let crossWidth = width * dy;
        let crossHeight = height * dx;
        if (crossWidth > crossHeight) {
          if (crossWidth > (-crossHeight)) { player.y = ob.y - player.h; player.vy = 0; player.grounded = true; }
          else { player.x = ob.x + ob.w; player.vx = 0; }
        } else {
          if (crossWidth > (-crossHeight)) { player.x = ob.x - player.w; player.vx = 0; }
          else { player.y = ob.y + ob.h; player.vy = 0; }
        }
      }
    });
  }

  if (curLvlData.obstacles) {
    curLvlData.obstacles.forEach(ob => {
      if (!ob.destroyed && player.x < ob.x + ob.w && player.x + player.w > ob.x && player.y < ob.y + ob.h && player.y + player.h > ob.y) {
        // NaOH Pool (Deadly for HCl)
        if (ob.type === 'NaOH') {
          startTime -= 5000; // Penalti 5 detik
          player.vy = -10;
          showToast("REAKSI EKSOTERMIK! +5s", true);
        }
        // NOx Air Pollution Reaction (NH3 is the hero that neutralizes it, HCl suffers)
        if (ob.type === 'nox_pollution') {
          if (activeMolecule === "NH3") {
            // Safe! SCR Reaction: NH3 neutralizes NOx to N2 and H2O
            if (Math.random() < 0.15) {
              spawnParticles(player.x + Math.random() * player.w, player.y + Math.random() * player.h, '#ffffff', 1); // Water steam
              spawnParticles(player.x + Math.random() * player.w, player.y + Math.random() * player.h, '#3498db', 1); // Nitrogen gas visual
            }
            if (!player.lastPollutionWarn || Date.now() - player.lastPollutionWarn > 3000) {
              showToast("REAKSI SCR: NH₃ + NOx → N₂ & H₂O Aman! Udara Bersih!", false);
              player.lastPollutionWarn = Date.now();
            }
          } else if (activeMolecule === "HCl") {
            // Acid + NOx -> Highly toxic reaction, time runs extremely fast!
            startTime -= 50; // Waktu berjalan cepat per frame
            shakeAmount = 1.5;
            if (Math.random() < 0.3) {
              spawnParticles(player.x + Math.random() * player.w, player.y + Math.random() * player.h, '#e67e22', 2); // Toxic brown particles
            }
            if (!player.lastPollutionWarn || Date.now() - player.lastPollutionWarn > 3000) {
              showToast("REAKSI BERACUN: HCl + NOx → Gas NOCl & Cl₂ Beracun! Waktu dipercepat!", true);
              player.lastPollutionWarn = Date.now();
            }
          } else {
            // Others suffer standard toxicity
            startTime -= 30; // Waktu berjalan cepat per frame
            shakeAmount = 2;
            if (Math.random() < 0.2) {
              spawnParticles(player.x + Math.random() * player.w, player.y + Math.random() * player.h, '#9b59b6', 2);
            }
            if (!player.lastPollutionWarn || Date.now() - player.lastPollutionWarn > 3000) {
              showToast("TERPAPAR POLUSI NOx! Waktu berjalan cepat!", true);
              player.lastPollutionWarn = Date.now();
            }
          }
        }
        if (ob.type === 'POISON' || ob.type === 'H2O') { startTime -= 5000; player.vy = -10; showToast("PENALTY! +5s", true); }
        if (ob.type === 'Cu' && activeMolecule === "Fe") {
          ob.destroyed = true;
          shakeAmount = 4;
          showToast("REAKSI DESAKAN LOGAM: Besi (Fe) Mendeposit Tembaga (Cu)!", false);
          for (let i = 0; i < 4; i++) {
            particles.push({
              x: ob.x + ob.w / 2, y: ob.y + ob.h / 2,
              vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2,
              size: Math.random() * 4 + 2, color: '#e67e22', life: 1.0
            });
          }
        }
      }
    });
  }

  if (curLvlData.lever) {
    const lb = { x: curLvlData.lever.x - 20, y: curLvlData.lever.y - 20, w: 70, h: 50 };
    if (!curLvlData.lever.active && player.x < lb.x + lb.w && player.x + player.w > lb.x && player.y < lb.y + lb.h && player.y + player.h > lb.y) { curLvlData.lever.active = true; showToast("POWER ACTIVE!"); }
    if (!curLvlData.gate.destroyed && player.x < curLvlData.gate.x + curLvlData.gate.w && player.x + player.w > curLvlData.gate.x && player.y < curLvlData.gate.y + curLvlData.gate.h && player.y + player.h > curLvlData.gate.y) {
      if (curLvlData.lever.active) {
        curLvlData.gate.destroyed = true;
        shakeAmount = 45;
        spawnParticles(curLvlData.gate.x + 15, curLvlData.gate.y + 60, '#f1c40f', 30);
        showToast("REAKSI DESAKAN LOGAM: Besi (Fe) Berenergi Tinggi Mendesak Emas (Au)!", false);
      } else {
        player.x = curLvlData.gate.x - player.w;
        if (!player.lastPowerWarn || Date.now() - player.lastPowerWarn > 2000) {
          showToast("REAKSI LEMAH: Kekuatan Besi (Fe) kurang! Ambil Power Pad dulu.", true);
          player.lastPowerWarn = Date.now();
        }
      }
    }
  }

  if (curLvlData.trashDevice) {
    let td = curLvlData.trashDevice;
    if (player.x < td.x + td.w && player.x + player.w > td.x && player.y < td.y + td.h && player.y + player.h > td.y) {
      if (collectedAtoms.length > 0) {
        collectedAtoms = [];
        activeMolecule = "Stickman";
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#2ecc71', 25);
        showToast("WADAH DIKOSONGKAN! Bebas mengumpulkan kembali.", false);
      }
    }
  }

  particles.forEach((p, i) => { p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.life -= 0.02; if (p.life <= 0) particles.splice(i, 1); });
  if (shakeAmount > 0) shakeAmount *= 0.9;

  if (player.x < curLvlData.exit.x + curLvlData.exit.w && player.x + player.w > curLvlData.exit.x &&
    player.y < curLvlData.exit.y + curLvlData.exit.h && player.y + player.h > curLvlData.exit.y) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      showToast("LEVEL COMPLETE!");
      loadLevel(currentLevel, true); // Keep the speedrun timer running continuously!
    } else {
      gameActive = false;
      let finishTime = elapsedSeconds;
      let grade = "B";
      if (finishTime < 55) grade = "S";
      else if (finishTime < 85) grade = "A";

      showCongratsModal(finishTime, grade);
    }
  }
}


// --- DRAW ---

function draw() {
  ctx.save();
  if (shakeAmount > 0) ctx.translate((Math.random() - 0.5) * shakeAmount, (Math.random() - 0.5) * shakeAmount);

  // Background Tint (pH Shift)
  let bg = '#0a0d14';
  if (activeMolecule === "HCl") bg = '#1a0d0d'; // Red tint
  if (activeMolecule === "NH3") bg = '#0d131a'; // Blue tint
  ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (curLvlData.fans) {
    curLvlData.fans.forEach(f => {
      // Draw a subtle translucent background for the fan zone
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(f.x, f.y, f.w, f.h);

      // Draw gentle moving wind streaks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      let timeOffset = Date.now() * 0.15;
      for (let sy = f.y + 10; sy < f.y + f.h; sy += 25) {
        let startX = f.x + ((timeOffset + sy * 5) % (f.w + 100)) - 100;
        ctx.beginPath();
        ctx.moveTo(startX, sy);
        ctx.lineTo(startX + 60, sy);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("ANGIN", f.x + f.w / 2, f.y + f.h / 2);
    });
  }

  if (curLvlData.boxes) {
    curLvlData.boxes.forEach(box => {
      ctx.fillStyle = '#95a5a6';
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeStyle = '#2c3e50';
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      drawBoxLabel(box.label || "BOX", box.x, box.y, box.w, box.h, '#fff');
    });
  }

  curLvlData.platforms.forEach(p => {
    if (p.type === 'stone') ctx.fillStyle = '#222';
    else if (p.type === 'iron') ctx.fillStyle = '#7f8c8d';
    else if (p.type === 'NaOH') ctx.fillStyle = '#8e44ad'; // Purple Platform
    else if (p.type === 'limestone') ctx.fillStyle = '#f5f5dc'; // Cream Platform
    else if (p.type === 'water') {
      let grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, 'rgba(0, 150, 255, 0.75)');
      grad.addColorStop(1, 'rgba(0, 50, 150, 0.95)');
      ctx.fillStyle = grad;
    } else if (p.type === 'poison') {
      let grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, 'rgba(155, 89, 182, 0.75)'); // Toxic purple acid
      grad.addColorStop(1, 'rgba(100, 30, 120, 0.95)');
      ctx.fillStyle = grad;
    } else if (p.type === 'fire') {
      let grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#e74c3c');
      grad.addColorStop(1, '#962d22');
      ctx.fillStyle = grad;
    } else ctx.fillStyle = '#5d4037'; // Wood

    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = '#444'; ctx.strokeRect(p.x, p.y, p.w, p.h);

    // Spawning embers from fire platform
    if (p.type === 'fire' && Math.random() < 0.08) {
      particles.push({
        x: p.x + Math.random() * p.w,
        y: p.y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 2 + 1.5,
        color: '#e67e22',
        life: 0.8
      });
    }

    // Render Label if exists
    if (p.label) {
      drawBoxLabel(p.label, p.x, p.y, p.w, p.h, '#fff');
    }
  });

  if (curLvlData.obstacles) {
    curLvlData.obstacles.forEach(ob => {
      if (ob.type === 'POISON') { ctx.fillStyle = 'rgba(155, 89, 182, 0.6)'; ctx.fillRect(ob.x, ob.y, ob.w, ob.h); }
      if (ob.type === 'H2O') { ctx.fillStyle = 'rgba(0, 100, 255, 0.5)'; ctx.fillRect(ob.x, ob.y, ob.w, ob.h); }
      if (ob.type === 'Cu' && !ob.destroyed) { ctx.fillStyle = '#e67e22'; ctx.fillRect(ob.x, ob.y, ob.w, ob.h); }
      if (ob.type === 'NaOH') { ctx.fillStyle = 'rgba(142, 68, 173, 0.8)'; ctx.fillRect(ob.x, ob.y, ob.w, ob.h); }
      if (ob.type === 'limestone') { ctx.fillStyle = '#f5f5dc'; ctx.fillRect(ob.x, ob.y, ob.w, ob.h); }
      if (ob.type === 'nox_pollution') {
        // 1. Reddish-brown toxic nitrogen dioxide gas mist
        let grad = ctx.createLinearGradient(ob.x, ob.y, ob.x, ob.y + ob.h);
        grad.addColorStop(0, 'rgba(230, 126, 34, 0.22)'); // Dark toxic orange
        grad.addColorStop(1, 'rgba(211, 84, 0, 0.04)');  // Fades down
        ctx.fillStyle = grad;
        ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

        // 2. Animated floating toxic NOx pollutant specks drifting right to left
        let timeOffset = Date.now() * 0.05;
        ctx.fillStyle = 'rgba(211, 84, 0, 0.7)';

        for (let i = 0; i < 45; i++) {
          let speed = 0.5 + (i % 3) * 0.3;
          let seedX = ob.w - ((timeOffset * speed + i * 35) % (ob.w + 40));
          let seedY = ob.y + ((i * 17) % ob.h);

          // Draw a small toxic soot particle
          ctx.fillRect(ob.x + seedX, seedY, 3, 3);

          // Draw a smaller particle nearby for depth
          ctx.fillStyle = 'rgba(230, 126, 34, 0.4)';
          ctx.fillRect(ob.x + seedX + 5, seedY - 4, 1.5, 1.5);
          ctx.fillStyle = 'rgba(211, 84, 0, 0.7)';
        }
      }
      if (ob.label && !ob.destroyed) {
        let textColor = '#fff';
        if (ob.type === 'Cu') textColor = '#000';
        drawBoxLabel(ob.label, ob.x, ob.y, ob.w, ob.h, textColor);
      }
    });
  }

  if (curLvlData.obstacles2) {
    curLvlData.obstacles2.forEach(ob => {
      if (ob.type === 'limestone') {
        ctx.fillStyle = '#f5f5dc';
        ctx.strokeStyle = '#d2b48c';
        ctx.lineWidth = 2;
        ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
        ctx.strokeRect(ob.x, ob.y, ob.w, ob.h);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
      }
      drawBoxLabel(ob.label, ob.x, ob.y, ob.w, ob.h, '#000');
    });
  }

  if (curLvlData.items) {
    curLvlData.items.forEach(it => {
      let color = '#fff';
      if (it.label === 'C') color = '#95a5a6';
      if (it.label === 'O') color = '#e74c3c';
      ctx.beginPath(); ctx.arc(it.x, it.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = '#000'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
      ctx.fillText(it.label, it.x, it.y + 4);
    });
  }

  if (curLvlData.lever) {
    ctx.fillStyle = curLvlData.lever.active ? '#2ecc71' : '#c0392b';
    ctx.fillRect(curLvlData.lever.x, curLvlData.lever.y, 20, 20);
    if (!curLvlData.gate.destroyed) {
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(curLvlData.gate.x, curLvlData.gate.y, curLvlData.gate.w, curLvlData.gate.h);
      drawBoxLabel("Au", curLvlData.gate.x, curLvlData.gate.y, curLvlData.gate.w, curLvlData.gate.h, '#000');
    }
  }

  if (curLvlData.trashDevice) {
    let td = curLvlData.trashDevice;
    ctx.fillStyle = '#34495e';
    ctx.fillRect(td.x, td.y, td.w, td.h);
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(td.x, td.y, td.w, 4);
    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("TRASH", td.x + td.w / 2, td.y + 18);
  }



  drawStickman(player.x, player.y, player.w, player.h, player.vx, player.grounded, player.stun);
  // Draw Premium Golden Exit Portal with Flag
  const ex = curLvlData.exit;
  if (ex) {
    // 1. Draw Golden Gate Frame
    let goldGrad = ctx.createLinearGradient(ex.x, ex.y, ex.x + ex.w, ex.y);
    goldGrad.addColorStop(0, '#f39c12');
    goldGrad.addColorStop(0.5, '#f1c40f');
    goldGrad.addColorStop(1, '#f39c12');

    // Frame columns
    ctx.fillStyle = goldGrad;
    ctx.fillRect(ex.x, ex.y, 6, ex.h); // Left column
    ctx.fillRect(ex.x + ex.w - 6, ex.y, 6, ex.h); // Right column
    ctx.fillRect(ex.x, ex.y, ex.w, 6); // Top beam

    // 2. Draw glowing golden swirl inside portal
    let portalGrad = ctx.createRadialGradient(ex.x + ex.w / 2, ex.y + ex.h / 2, 2, ex.x + ex.w / 2, ex.y + ex.h / 2, ex.w / 2);
    portalGrad.addColorStop(0, 'rgba(255, 242, 0, 0.45)');
    portalGrad.addColorStop(1, 'rgba(243, 156, 18, 0.05)');
    ctx.fillStyle = portalGrad;
    ctx.fillRect(ex.x + 6, ex.y + 6, ex.w - 12, ex.h - 6);

    // Magic particles swirling in exit portal (adds extremely premium feel!)
    if (Math.random() < 0.15) {
      particles.push({
        x: ex.x + 6 + Math.random() * (ex.w - 12),
        y: ex.y + ex.h - 5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 1.5 - 0.5,
        size: Math.random() * 2 + 1,
        color: '#f1c40f',
        life: 0.7
      });
    }

    // 3. Draw Flag on top of the gate
    ctx.strokeStyle = '#f1c40f'; // Golden flagpole
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ex.x + ex.w / 2, ex.y);
    ctx.lineTo(ex.x + ex.w / 2, ex.y - 22); // Flagpole height 22px
    ctx.stroke();

    // Triangular waving flag
    let flagWave = Math.sin(Date.now() / 150) * 3; // dynamic wave animation!
    ctx.fillStyle = '#e74c3c'; // Vibrant Red Flag
    ctx.beginPath();
    ctx.moveTo(ex.x + ex.w / 2, ex.y - 22);
    ctx.lineTo(ex.x + ex.w / 2 + 18, ex.y - 15 + flagWave);
    ctx.lineTo(ex.x + ex.w / 2, ex.y - 8);
    ctx.closePath();
    ctx.fill();

    // Flag border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); });
  ctx.globalAlpha = 1; ctx.restore(); drawUI();
}

function drawBoxLabel(label, x, y, w, h, textColor = '#fff') {
  if (!label) return;
  ctx.save();
  ctx.fillStyle = textColor;
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (h > w) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(label, 0, 0);
  } else {
    ctx.fillText(label, x + w / 2, y + h / 2);
  }
  ctx.restore();
}

function drawStickman(x, y, w, h, vx, grounded, stun) {
  ctx.save(); ctx.translate(x + w / 2, y + h); if (stun > 0) ctx.scale(1.2, 0.8);

  let color = '#00d2ff';
  if (activeMolecule === "CH4") color = '#2ecc71';
  if (activeMolecule === "SF6") color = '#9b59b6';
  if (activeMolecule === "Fe") color = '#bdc3c7';
  if (activeMolecule === "HCl") color = '#e74c3c';
  if (activeMolecule === "He") color = '#f1c40f';
  if (activeMolecule === "N2") color = '#34495e';
  if (activeMolecule === "Stickman") color = '#ffffff';
  if (activeMolecule === "H2O") {
    color = '#00f6ff';
    ctx.beginPath();
    ctx.arc(0, -h / 2, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 246, 255, 0.25)';
    ctx.fill();
  }
  if (activeMolecule === "CH2O") {
    color = '#8e44ad';
    ctx.beginPath();
    ctx.arc(0, -h / 2, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(142, 68, 173, 0.25)';
    ctx.fill();
  }
  if (activeMolecule === "NH3") {
    color = '#3498db';
    // NH3 Aura
    ctx.beginPath();
    ctx.arc(0, -h / 2, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    ctx.fill();
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -h + 10, 8, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -h + 18); ctx.lineTo(0, -h / 2); ctx.stroke();
  let armAngle = Math.sin(player.walkCycle) * 0.5; if (!grounded) armAngle = 1.5;
  ctx.beginPath(); ctx.moveTo(0, -h + 25); ctx.lineTo(Math.sin(armAngle) * 15, -h + 35);
  ctx.moveTo(0, -h + 25); ctx.lineTo(Math.sin(-armAngle) * 15, -h + 35); ctx.stroke();
  let legAngle = Math.sin(player.walkCycle) * 0.8; if (!grounded) legAngle = 0.5;
  ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(Math.sin(legAngle) * 15, 0);
  ctx.moveTo(0, -h / 2); ctx.lineTo(Math.sin(-legAngle) * 15, 0); ctx.stroke();

  // Draw the gathered atoms formatted as a real chemical formula (e.g. C, C2, CH, H2O, CH2O)
  let formula = getCollectedFormulaString();
  if (formula) {
    ctx.fillStyle = '#ffffff'; // Clean white, no double blue UI
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(formula, 0, -h - 12);
  }

  ctx.restore();
}

function drawUI() {
  let color = '#fff';
  if (activeMolecule === "CH4") color = '#2ecc71';
  if (activeMolecule === "SF6") color = '#9b59b6';
  if (activeMolecule === "Fe") color = '#bdc3c7';
  if (activeMolecule === "HCl") color = '#e74c3c';
  if (activeMolecule === "NH3") color = '#3498db';
  if (activeMolecule === "He") color = '#f1c40f';
  if (activeMolecule === "N2") color = '#34495e';
  if (activeMolecule === "Stickman") color = '#ffffff';
  if (activeMolecule === "H2O") color = '#00f6ff';
  if (activeMolecule === "CH2O") color = '#8e44ad';

  ctx.fillStyle = color; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText(timerValue + " | " + activeMolecule, 400, 35);
  ctx.font = '11px monospace'; ctx.fillText("LV " + (currentLevel + 1) + ": " + curLvlData.name, 400, 52);
}

function spawnParticles(x, y, color, count = 20) {
  for (let i = 0; i < count; i++) {
    particles.push({ x, y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, size: Math.random() * 3 + 2, color, life: 1.0 });
  }
}
function showToast(msg, isErr) { 
  let t = document.createElement('div'); 
  Object.assign(t.style, { 
    position: 'fixed', 
    bottom: '25px', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    background: isErr ? 'rgba(192, 57, 43, 0.65)' : 'rgba(8, 12, 20, 0.65)', 
    border: isErr ? '1px solid rgba(192, 57, 43, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    webkitBackdropFilter: 'blur(5px)',
    color: isErr ? '#ff6b6b' : '#00d2ff', 
    padding: '6px 14px', 
    borderRadius: '20px', 
    zIndex: '10000',
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    pointerEvents: 'none',
    opacity: '0.85',
    transition: 'opacity 0.2s'
  }); 
  t.textContent = msg; 
  document.body.appendChild(t); 
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 200);
  }, 1800); 
}

function gameLoop() { update(); draw(); if (gameActive) requestAnimationFrame(gameLoop); }

window.addEventListener('keydown', e => {
  if (!gameActive) return;

  // Instant Spacebar Speedrun Restart (Level 1, Time = 0)
  if (e.key === ' ') {
    currentLevel = 0;
    loadLevel(0, false);
    showToast("RESTART RUN: Mulai dari Level 1!", false);
    spawnParticles(player.x + 12, player.y + 20, '#f1c40f', 25);
    return;
  }

  if (player.stun > 0 || player.ignorePlatforms > 0) return;

  let key = e.key.toLowerCase();
  let mult = (player.drunkTimer > 0) ? -1 : 1;
  if (e.key === 'ArrowRight' || key === 'd') player.vx = player.speed * mult;
  if (e.key === 'ArrowLeft' || key === 'a') player.vx = -player.speed * mult;
  if ((e.key === 'ArrowUp' || key === 'w') && player.grounded) player.vy = player.jump;

  if (key === 'r' && currentLevel === 3) {
    collectedAtoms = [];
    activeMolecule = "Stickman";
    player.drunkTimer = 0;
    curLvlData.items.forEach(it => it.collected = false);
    showToast("FORMULA DI-RESET!");
    spawnParticles(player.x + 12, player.y + 20, '#ffffff', 10);
  }

  if (key === 'c' && curLvlData.inventory && curLvlData.inventory.length > 0) {
    let idx = curLvlData.inventory.indexOf(activeMolecule);
    activeMolecule = curLvlData.inventory[(idx + 1) % curLvlData.inventory.length];
    showToast("SWAP: " + activeMolecule);
  }
  if (key === 'e') {
    if (activeMolecule === "CH4") {
      player.vy = -15; spawnParticles(player.x + 12, player.y + 40, '#f39c12'); showToast("COMBUSTION!");
    } else if (activeMolecule === "NH3") {
      spawnParticles(player.x + 12, player.y + 20, '#3498db', 40); // Awan Gas Besar
      showToast("GAS CLOUD!");
    }
  }
});
window.addEventListener('keyup', e => {
  if (player.ignorePlatforms > 0) return;
  let key = e.key.toLowerCase();
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || key === 'd' || key === 'a') player.vx = 0;
});

function showCongratsModal(finishTime, grade) {
  let overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(10, 13, 20, 0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '20000',
    fontFamily: "'Space Mono', monospace",
    color: '#fff',
    animation: 'fadeIn 0.5s ease'
  });

  let card = document.createElement('div');
  Object.assign(card.style, {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    width: '450px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    transform: 'scale(0.9)',
    animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
  });

  let title = document.createElement('h1');
  title.textContent = "🏆 MISI SELESAI!";
  Object.assign(title.style, {
    fontSize: '28px',
    color: '#2ecc71',
    textShadow: '0 0 15px rgba(46, 204, 113, 0.6)',
    marginBottom: '20px',
    letterSpacing: '2px'
  });

  let sub = document.createElement('p');
  sub.textContent = `Selamat ${playerName}! Kamu berhasil menaklukkan seluruh rintangan menara karat!`;
  Object.assign(sub.style, {
    fontSize: '14px',
    color: '#bdc3c7',
    marginBottom: '30px',
    lineHeight: '1.6'
  });

  let stats = document.createElement('div');
  Object.assign(stats.style, {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  });

  let timeBox = document.createElement('div');
  timeBox.innerHTML = `<span style="font-size:12px;color:#7f8c8d;display:block;">WAKTU</span>
                       <span style="font-size:24px;font-weight:bold;color:#f1c40f;">${finishTime}s</span>`;

  let tierBox = document.createElement('div');
  let tierColor = '#9b59b6';
  let tierTitle = 'Contaminated Matter';
  if (grade === 'S') { tierColor = '#2ecc71'; tierTitle = 'Chemical Architect'; }
  else if (grade === 'A') { tierColor = '#3498db'; tierTitle = 'Precision Synthesizer'; }

  tierBox.innerHTML = `<span style="font-size:12px;color:#7f8c8d;display:block;">TIER / GRADE</span>
                       <span style="font-size:32px;font-weight:bold;color:${tierColor};text-shadow:0 0 10px ${tierColor}88;">${grade}</span>`;

  stats.appendChild(timeBox);
  stats.appendChild(tierBox);

  let desc = document.createElement('p');
  desc.textContent = `Gelar: ${tierTitle}`;
  Object.assign(desc.style, {
    fontSize: '14px',
    fontWeight: 'bold',
    color: tierColor,
    marginBottom: '35px'
  });

  let btn = document.createElement('button');
  btn.textContent = "MAIN LAGI";
  Object.assign(btn.style, {
    background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    padding: '12px 35px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    boxShadow: '0 5px 15px rgba(46,204,113,0.4)',
    transition: '0.2s'
  });
  btn.onclick = () => {
    location.reload();
  };

  card.appendChild(title);
  card.appendChild(sub);
  card.appendChild(stats);
  card.appendChild(desc);
  card.appendChild(btn);
  overlay.appendChild(card);

  // Add styles dynamically
  let style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  document.head.appendChild(style);

  document.getElementById('gameContainer').appendChild(overlay);
}

// ON-SCREEN TOUCH CONTROLS FOR MOBILE
const tLeft = document.getElementById('touchLeft');
const tRight = document.getElementById('touchRight');
const tJump = document.getElementById('touchJump');
const tSwap = document.getElementById('touchSwap');

if (tLeft && tRight && tJump && tSwap) {
  const getMult = () => (player.drunkTimer > 0) ? -1 : 1;

  // Touch Left
  tLeft.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!gameActive || player.stun > 0 || player.ignorePlatforms > 0) return;
    player.vx = -player.speed * getMult();
  });
  tLeft.addEventListener('touchend', e => {
    e.preventDefault();
    if (player.ignorePlatforms > 0) return;
    player.vx = 0;
  });
  tLeft.addEventListener('touchcancel', e => {
    e.preventDefault();
    player.vx = 0;
  });

  // Touch Right
  tRight.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!gameActive || player.stun > 0 || player.ignorePlatforms > 0) return;
    player.vx = player.speed * getMult();
  });
  tRight.addEventListener('touchend', e => {
    e.preventDefault();
    if (player.ignorePlatforms > 0) return;
    player.vx = 0;
  });
  tRight.addEventListener('touchcancel', e => {
    e.preventDefault();
    player.vx = 0;
  });

  // Touch Jump
  tJump.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!gameActive || player.stun > 0 || player.ignorePlatforms > 0) return;
    if (player.grounded) {
      player.vy = player.jump;
    }
  });

  // Touch Swap
  tSwap.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!gameActive) return;
    if (curLvlData.inventory && curLvlData.inventory.length > 0) {
      let idx = curLvlData.inventory.indexOf(activeMolecule);
      activeMolecule = curLvlData.inventory[(idx + 1) % curLvlData.inventory.length];
      showToast("SWAP: " + activeMolecule);
    }
  });
}
