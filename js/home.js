/* ============================================================
   HOME.JS — Home Page Logic (Visualizer & Builder)
   ============================================================ */

let isBuilderActive = false;
let activeMolKey = "CH4";
let currentFormulaAtoms = []; // stores objects like { symbol: 'H', count: 2 }

function initHome() {
  setupHomeEvents();
  buildMolGrid();
  updateFormulaDisplay(); // Set initial formulator placeholder
  
  // Initial render with a small delay for container stability
  setTimeout(() => {
    const initMol = MOLECULES[activeMolKey] || Object.values(MOLECULES)[0];
    if (initMol) {
      drawMolecule(initMol);
      updateInfoPanelWith(initMol);
    }
  }, 100);
}

function setupHomeEvents() {
  document.getElementById('btnKatalog')?.addEventListener('click', () => {
    isBuilderActive = false;
    document.getElementById('btnKatalog')?.classList.add('active');
    document.getElementById('btnPeriodik')?.classList.remove('active');
    document.getElementById('molGrid')?.classList.remove('hidden');
    document.getElementById('periodikBuilder')?.classList.add('hidden');
  });

  document.getElementById('btnPeriodik')?.addEventListener('click', () => {
    isBuilderActive = true;
    document.getElementById('btnPeriodik')?.classList.add('active');
    document.getElementById('btnKatalog')?.classList.remove('active');
    document.getElementById('periodikBuilder')?.classList.remove('hidden');
    document.getElementById('molGrid')?.classList.add('hidden');
  });

  document.getElementById('btnClear')?.addEventListener('click', () => clearFormula());
  
  document.getElementById('btnRender')?.addEventListener('click', () => {
    const data = getMoleculeDataByAtoms(currentFormulaAtoms);
    if (data) {
      drawMolecule(data);
      updateInfoPanelWith(data);
      
      // Highlight the rendered molecule in the catalog grid
      const matchedKey = Object.keys(MOLECULES).find(k => MOLECULES[k] === data);
      if (matchedKey) {
        activeMolKey = matchedKey;
        buildMolGrid();
      }
      
      showToast('✓ Molekul berhasil dirender!', false);
    } else {
      showToast('Molekul tidak ditemukan di database', true);
    }
  });

  document.querySelectorAll('.pt-element').forEach(el => {
    el.addEventListener('click', () => {
      const sym = el.getAttribute('data-symbol');
      if (sym) {
        if (isBuilderActive) {
          appendFormula(sym);
        } else {
          renderSingleAtom(sym);
        }
      }
    });
  });

  // Keyboard number and backspace input for builder
  window.addEventListener('keydown', (e) => {
    if (isBuilderActive) {
      if (e.key >= '0' && e.key <= '9') {
        appendFormula(e.key);
      }
      if (e.key === 'Backspace') {
        if (currentFormulaAtoms.length > 0) {
          const last = currentFormulaAtoms[currentFormulaAtoms.length - 1];
          if (last.count > 1) {
            last.count--;
          } else {
            currentFormulaAtoms.pop();
          }
          updateFormulaDisplay();
        }
      }
    }
  });
}

function appendFormula(symbol) {
  // Check if input is a digit (number multiplier)
  if (/^\d+$/.test(symbol)) {
    const num = parseInt(symbol, 10);
    if (currentFormulaAtoms.length > 0 && num > 0) {
      // Multiply or set the last clicked atom count
      currentFormulaAtoms[currentFormulaAtoms.length - 1].count = num;
    }
  } else {
    // Check if the last atom clicked was the exact same element
    if (currentFormulaAtoms.length > 0 && currentFormulaAtoms[currentFormulaAtoms.length - 1].symbol === symbol) {
      // If same symbol, increment count (e.g. click H 2 times -> H2)
      currentFormulaAtoms[currentFormulaAtoms.length - 1].count++;
    } else {
      // Add new element to formula
      currentFormulaAtoms.push({ symbol: symbol, count: 1 });
    }
  }
  updateFormulaDisplay();
}

function clearFormula() {
  currentFormulaAtoms = [];
  updateFormulaDisplay();
  showToast('Formulator dibersihkan', false);
}

function updateFormulaDisplay() {
  const display = document.getElementById('formulaDisplay');
  if (!display) return;
  if (currentFormulaAtoms.length === 0) {
    display.innerHTML = '<span style="color: var(--text3); font-size: 14px;">Mulai klik unsur di bawah untuk merakit...</span>';
    return;
  }
  let html = '';
  currentFormulaAtoms.forEach(atom => {
    html += atom.symbol;
    if (atom.count > 1) {
      html += `<sub>${atom.count}</sub>`;
    }
  });
  display.innerHTML = html;
}

// Smart composition-based and exact formula matcher
function getMoleculeDataByAtoms(atomsList) {
  if (atomsList.length === 0) return null;
  
  // 1. Exact string matching (e.g. "H2O")
  let searchStr = '';
  atomsList.forEach(atom => {
    searchStr += atom.symbol;
    if (atom.count > 1) searchStr += atom.count;
  });
  
  const exactKey = Object.keys(MOLECULES).find(k => k.toLowerCase() === searchStr.toLowerCase());
  if (exactKey) {
    return MOLECULES[exactKey];
  }
  
  // 2. Composition matching (e.g. "OH2" matches "H2O")
  const currentComp = {};
  atomsList.forEach(atom => {
    currentComp[atom.symbol] = (currentComp[atom.symbol] || 0) + atom.count;
  });
  
  for (const [key, mol] of Object.entries(MOLECULES)) {
    const molComp = {};
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    while ((match = regex.exec(key)) !== null) {
      const sym = match[1];
      const count = match[2] ? parseInt(match[2], 10) : 1;
      molComp[sym] = (molComp[sym] || 0) + count;
    }
    
    // Compare compositions
    const keys1 = Object.keys(currentComp);
    const keys2 = Object.keys(molComp);
    if (keys1.length === keys2.length) {
      let isMatch = true;
      for (const k of keys1) {
        if (currentComp[k] !== molComp[k]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) return mol;
    }
  }
  
  return null;
}

function buildMolGrid() {
  const grid = document.getElementById('molGrid');
  if (!grid) return;
  const list = Object.entries(MOLECULES);
  grid.innerHTML = '';
  list.forEach(([key, m]) => {
    const card = document.createElement('div');
    card.className = 'mol-card' + (key === activeMolKey ? ' active' : '');
    card.innerHTML = `<div class="mol-formula">${m.formula}</div><div class="mol-name">${m.name}</div>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.mol-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeMolKey = key;
      drawMolecule(m);
      updateInfoPanelWith(m);
    });
    grid.appendChild(card);
  });
}

function updateInfoPanelWith(mol) {
  if (!mol) return;
  document.getElementById('activeMolFormula').textContent = mol.formula;
  document.getElementById('activeMolName').textContent = mol.name;
  document.getElementById('geoName').textContent = mol.geo || '—';
  document.getElementById('geoAxe').textContent = mol.axe ? `Notasi: ${mol.axe}` : '—';
  document.getElementById('statPEI').textContent = mol.pei ?? '—';
  document.getElementById('statPEB').textContent = mol.peb ?? '—';
  document.getElementById('infoDesc').textContent = mol.desc || '';
  const angDiv = document.getElementById('infoAngles');
  if (angDiv && mol.angles) {
    angDiv.innerHTML = mol.angles.map(a =>
      `<div class="angle-row"><span class="angle-label">${a.label}</span> : <span class="angle-val">${a.val}</span></div>`
    ).join('');
  }
}

function renderSingleAtom(symbol) {
  const color = ELEMENTS_COLOR[symbol] || '#888888';
  const atomData = {
    formula: symbol, name: `Unsur ${symbol}`, geo: 'Atom Tunggal', axe: '—', pei: 0, peb: 0,
    desc: `Representasi 3D dari atom tunggal ${symbol}.`,
    angles: [], atoms: [{ x:0, y:0, z:0, r:0.5, color: color, symbol: symbol }], bonds: []
  };
  drawMolecule(atomData);
  updateInfoPanelWith(atomData);
  showToast(`Visualisasi Atom ${symbol}`, false);
}

function showToast(msg, isError) {
  const overlay = document.getElementById('toastOverlay');
  if (!overlay) return;
  overlay.querySelector('.toast-box').classList.toggle('error', isError);
  overlay.querySelector('.toast-msg').textContent = msg;
  overlay.querySelector('.toast-icon').textContent = isError ? '⚠' : '✓';
  overlay.classList.add('show');
  setTimeout(() => overlay.classList.remove('show'), 3000);
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof initEngine3D === 'function') initEngine3D();
  initHome();
});
