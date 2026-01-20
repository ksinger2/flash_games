/* =============================================
   THROWBACK TIZZY - Main Application
   ============================================= */

// Check if mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// State
let currentPage = 'home';
let currentShow = null;
let uploadedGames = [];
let rufflePlayer = null;

// DOM Elements
const showScroller = document.getElementById('show-scroller');
const mainContent = document.getElementById('main-content');
const gameModal = document.getElementById('game-modal');
const gameModalTitle = document.getElementById('game-modal-title');
const gameContainer = document.getElementById('game-container');

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  renderShowScroller();
  renderHomePage();
  setupDragDrop();

  // Logo click goes home
  document.querySelector('.logo').addEventListener('click', goHome);
});

// =============================================
// SHOW SCROLLER
// =============================================

function renderShowScroller() {
  showScroller.innerHTML = '';

  SHOWS.forEach(show => {
    const thumb = document.createElement('div');
    thumb.className = 'show-thumb';
    thumb.setAttribute('data-title', show.title);
    thumb.setAttribute('data-id', show.id);

    const img = document.createElement('img');
    img.src = getShowImage(show);
    img.alt = show.title;
    img.onerror = function() {
      if (this.src.endsWith('.jpg')) {
        this.src = `games/${show.id}/title.jpeg`;
      } else if (this.src.endsWith('.jpeg')) {
        this.src = `games/${show.id}/title.webp`;
      } else if (this.src.endsWith('.webp')) {
        this.src = `games/${show.id}/title.png`;
      } else {
        this.src = getShowPlaceholder(show);
      }
    };

    thumb.appendChild(img);
    showScroller.appendChild(thumb);

    // Click handler
    thumb.addEventListener('click', () => openShowPage(show));
  });

  // Setup hover focus effect
  setupFocusEffect();
}

// Focus effect - hovered grows, neighbors shrink
function setupFocusEffect() {
  const thumbs = showScroller.querySelectorAll('.show-thumb');

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('mouseenter', () => {
      thumbs.forEach((t, i) => {
        t.classList.remove('focused', 'unfocused');

        if (i === index) {
          t.classList.add('focused');
        } else if (Math.abs(i - index) <= 2) {
          t.classList.add('unfocused');
        }
      });
    });
  });

  showScroller.addEventListener('mouseleave', () => {
    thumbs.forEach(t => {
      t.classList.remove('focused', 'unfocused');
    });
  });
}

// Scroll buttons
function scrollShows(direction) {
  const scrollAmount = 300;
  showScroller.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}

// Mark active show in scroller
function updateActiveShow(showId) {
  const thumbs = showScroller.querySelectorAll('.show-thumb');
  thumbs.forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-id') === showId);
  });
}

// =============================================
// NAVIGATION
// =============================================

function goHome() {
  currentPage = 'home';
  currentShow = null;
  updateActiveShow(null);
  renderHomePage();
}

function openShowPage(show) {
  currentPage = 'show';
  currentShow = show;
  updateActiveShow(show.id);
  renderShowPage(show);
}

// =============================================
// HOME PAGE
// =============================================

function renderHomePage() {
  const allGames = getAllGames();
  const popularGames = allGames.slice(0, 8); // First 8 as "popular"

  mainContent.innerHTML = `
    <h1 class="page-title">Popular Games</h1>

    <!-- Upload Section -->
    <div class="upload-section">
      <h3>Upload Games (.SWF / .DCR)</h3>
      <p style="color: var(--text-secondary); margin-bottom: 15px; font-size: 14px;">
        Add game files to the folders, or drag & drop here to play instantly.
      </p>
      <div class="upload-zone" id="upload-zone">
        <input type="file" id="file-input" accept=".swf,.dcr" multiple>
        <p style="margin-bottom: 15px; color: var(--text-secondary);">
          Drag & drop .SWF or .DCR files here
        </p>
        <label for="file-input" class="upload-btn">Choose Files</label>
      </div>
      <div class="uploaded-list" id="uploaded-list"></div>
    </div>

    <!-- Popular Games Grid -->
    <div class="section">
      <h2 class="section-title">Featured</h2>
      <div class="games-grid">
        ${popularGames.map(game => createGameCard(game)).join('')}
      </div>
    </div>
  `;

  // Re-attach upload handlers
  setupUploadHandlers();
  renderUploadedGames();
}

// =============================================
// SHOW PAGE
// =============================================

function renderShowPage(show) {
  mainContent.innerHTML = `
    <div class="show-page">
      <button class="back-btn" onclick="goHome()">← Back to Home</button>

      <div class="show-header">
        <img class="show-header-image" src="${getShowImage(show)}" alt="${show.title}" onerror="if(this.src.endsWith('.jpg')){this.src='games/${show.id}/title.jpeg'}else if(this.src.endsWith('.jpeg')){this.src='games/${show.id}/title.webp'}else if(this.src.endsWith('.webp')){this.src='games/${show.id}/title.png'}else{this.src='${getShowPlaceholder(show)}'}">
        <div class="show-header-info">
          <h1>${show.title}</h1>
          <p>${show.description}</p>
        </div>
      </div>

      <h2 class="section-title">Available Games</h2>
      <div class="games-grid">
        ${show.games.map(game => createGameCard({
          ...game,
          showId: show.id,
          showTitle: show.title,
          showColor: show.color
        })).join('')}
      </div>
    </div>
  `;
}

// =============================================
// GAME CARDS
// =============================================

function createGameCard(game) {
  const imgSrc = getGameImage(game, game.showColor);
  const jpegFallback = getGameImageFallback(game, game.showColor);
  const webpFallback = getGameImageWebp(game, game.showColor);
  const pngFallback = getGameImagePng(game, game.showColor);
  const placeholder = getGamePlaceholder(game, game.showColor);

  return `
    <div class="game-card" onclick="playGame('${game.id}', '${game.showId}')">
      <img class="game-card-image"
           src="${imgSrc}"
           alt="${game.title}"
           onerror="if(this.src.endsWith('.jpg')){this.src='${jpegFallback}'}else if(this.src.endsWith('.jpeg')){this.src='${webpFallback}'}else if(this.src.endsWith('.webp')){this.src='${pngFallback}'}else{this.src='${placeholder}'}">
      <div class="game-card-info">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-show">${game.showTitle}</div>
      </div>
    </div>
  `;
}

// =============================================
// GAME PLAYER (RUFFLE)
// =============================================

async function playGame(gameId, showId) {
  const show = SHOWS.find(s => s.id === showId);
  const game = show?.games.find(g => g.id === gameId);

  if (!game) return;

  gameModalTitle.textContent = `${game.title} - ${show.title}`;

  // Show mobile warning
  if (isMobile) {
    gameContainer.innerHTML = `
      <div class="game-placeholder">
        <h3>Desktop Recommended</h3>
        <p style="margin-bottom: 20px;">Flash games work best on a computer with a mouse and keyboard.</p>
        <p style="color: var(--text-secondary);">You can try anyway, but controls may not work properly on mobile.</p>
        <button onclick="playGameForce('${gameId}', '${showId}')" style="margin-top: 25px; padding: 12px 30px; background: linear-gradient(135deg, #9333ea, #06b6d4); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
          Try Anyway
        </button>
      </div>
    `;
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    return;
  }

  // Check if this game has an uploaded file first
  const uploaded = uploadedGames.find(u => u.id === gameId);

  if (uploaded) {
    // Play uploaded file
    if (uploaded.type === 'dcr') {
      await loadGameWithDirPlayer(uploaded.url, game.title);
    } else {
      await loadGameWithRuffle(uploaded.url, game.title);
    }
  } else if (game.folder) {
    // Try to detect file type - check for .dcr first, then .swf
    const gameFile = await detectGameFile(game.folder, game.id, game.file);
    if (gameFile) {
      if (gameFile.endsWith('.dcr')) {
        await loadGameWithDirPlayer(gameFile, game.title);
      } else {
        await loadGameWithRuffle(gameFile, game.title);
      }
    } else {
      // Show placeholder
      gameContainer.innerHTML = `
        <div class="game-placeholder">
          <h3>${game.title}</h3>
          <p>No game file loaded yet.</p>
          <p style="margin-top: 20px;">To play this game:</p>
          <p>1. Add <strong>game.swf</strong> or <strong>game.dcr</strong> to:</p>
          <p style="color: var(--accent-cyan); font-family: monospace;">${game.folder}/</p>
          <p style="margin-top: 10px;">2. Optionally add <strong>thumb.jpg</strong> for the thumbnail</p>
          <p style="margin-top: 10px;">3. Refresh and click play!</p>
        </div>
      `;
    }
  }

  gameModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Detect which game file exists in folder
async function detectGameFile(folder, gameId, customFile) {
  // If custom file specified, try that first
  if (customFile) {
    const url = `${folder}/${customFile}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return url;
    } catch (e) {}
  }

  // Common naming patterns to try
  const basenames = ['game', gameId, gameId.replace(/-/g, '_'), gameId.replace(/_/g, '-')];

  for (const ext of ['dcr', 'swf']) {
    for (const name of basenames) {
      const url = `${folder}/${name}.${ext}`;
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) return url;
      } catch (e) {}
    }
  }
  return null;
}

// Load DCR with DirPlayer (requires Chrome extension)
async function loadGameWithDirPlayer(dcrUrl, title) {
  gameContainer.innerHTML = `
    <div style="width: 800px; height: 600px; background: #000; display: flex; align-items: center; justify-content: center;">
      <embed
        src="${dcrUrl}"
        type="application/x-director"
        width="800"
        height="600"
        style="background: #000;"
      />
    </div>
    <p style="text-align: center; margin-top: 15px; color: var(--text-secondary); font-size: 14px;">
      DCR files require the <a href="https://chromewebstore.google.com/detail/dirplayer-shockwave-emula/gpgalkgegfekkmaknocegonkakahkhbc" target="_blank" style="color: var(--accent-cyan);">DirPlayer Chrome extension</a>
    </p>
  `;
}

async function loadGameWithRuffle(swfUrl, title) {
  gameContainer.innerHTML = '<div class="game-loading">Loading game...</div>';

  try {
    // Check if Ruffle is available
    if (typeof window.RufflePlayer === 'undefined') {
      throw new Error('Ruffle not loaded');
    }

    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();

    player.style.width = '800px';
    player.style.height = '600px';

    gameContainer.innerHTML = '';
    gameContainer.appendChild(player);

    await player.load(swfUrl);
    rufflePlayer = player;

  } catch (error) {
    console.error('Error loading game:', error);
    gameContainer.innerHTML = `
      <div class="game-placeholder">
        <h3>Could not load game</h3>
        <p style="color: #ef4444;">${error.message}</p>
        <p style="margin-top: 20px;">Make sure the .swf file exists at:</p>
        <p style="color: var(--accent-cyan); font-family: monospace;">${swfUrl}</p>
      </div>
    `;
  }
}

async function playUploadedGame(id) {
  const game = uploadedGames.find(g => g.id === id);
  if (!game) return;

  gameModalTitle.textContent = game.title;

  if (game.type === 'dcr') {
    await loadGameWithDirPlayer(game.url, game.title);
  } else {
    await loadGameWithRuffle(game.url, game.title);
  }

  gameModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGame() {
  gameModal.classList.remove('active');
  document.body.style.overflow = '';

  // Clean up Ruffle player
  if (rufflePlayer) {
    try {
      rufflePlayer.remove();
    } catch (e) {}
    rufflePlayer = null;
  }

  gameContainer.innerHTML = '';
}

// Close with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGame();
});

// Force play on mobile (bypass warning)
async function playGameForce(gameId, showId) {
  const show = SHOWS.find(s => s.id === showId);
  const game = show?.games.find(g => g.id === gameId);

  if (!game) return;

  const uploaded = uploadedGames.find(u => u.id === gameId);

  if (uploaded) {
    if (uploaded.type === 'dcr') {
      await loadGameWithDirPlayer(uploaded.url, game.title);
    } else {
      await loadGameWithRuffle(uploaded.url, game.title);
    }
  } else if (game.folder) {
    const gameFile = await detectGameFile(game.folder, game.id, game.file);
    if (gameFile) {
      if (gameFile.endsWith('.dcr')) {
        await loadGameWithDirPlayer(gameFile, game.title);
      } else {
        await loadGameWithRuffle(gameFile, game.title);
      }
    }
  }
}

// =============================================
// FILE UPLOAD
// =============================================

function setupUploadHandlers() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');

  if (!uploadZone || !fileInput) return;

  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  uploadZone.addEventListener('click', (e) => {
    if (e.target === uploadZone || e.target.tagName === 'P') {
      fileInput.click();
    }
  });
}

function setupDragDrop() {
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    const uploadZone = document.getElementById('upload-zone');
    if (uploadZone) uploadZone.classList.add('dragover');
  });

  document.addEventListener('dragleave', (e) => {
    const uploadZone = document.getElementById('upload-zone');
    if (uploadZone) uploadZone.classList.remove('dragover');
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const uploadZone = document.getElementById('upload-zone');
    if (uploadZone) uploadZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    handleFiles(files);
  });
}

function handleFiles(files) {
  Array.from(files).forEach(file => {
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.swf') || lowerName.endsWith('.dcr')) {
      const url = URL.createObjectURL(file);
      const ext = lowerName.endsWith('.dcr') ? 'dcr' : 'swf';
      const game = {
        id: 'uploaded-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.(swf|dcr)$/i, '').replace(/[_-]/g, ' '),
        url: url,
        file: file,
        type: ext
      };
      uploadedGames.push(game);
    }
  });

  renderUploadedGames();
}

function renderUploadedGames() {
  const list = document.getElementById('uploaded-list');
  if (!list) return;

  if (uploadedGames.length === 0) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = `
    <h4 style="margin-bottom: 15px; color: var(--accent-cyan);">
      Uploaded Games (${uploadedGames.length})
    </h4>
    ${uploadedGames.map(game => `
      <div class="uploaded-item">
        <span class="uploaded-item-name">${game.title}</span>
        <button class="play-uploaded-btn" onclick="playUploadedGame('${game.id}')">
          Play
        </button>
      </div>
    `).join('')}
  `;
}
