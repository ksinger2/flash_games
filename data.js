/* =============================================
   SHOWS & GAMES DATA
   Edit this file to add shows and games

   Each show folder (games/show-name/) can have:
   - title.jpg, title.jpeg, title.webp, or title.png (show thumbnail)

   Each game folder (games/show-name/game-name/) should contain:
   - game.swf OR game.dcr (Flash or Shockwave file)
   - thumb.jpg, thumb.jpeg, thumb.webp, or thumb.png (game thumbnail)

   For DCR files: Install DirPlayer Chrome extension
   https://chromewebstore.google.com/detail/dirplayer-shockwave-emula/gpgalkgegfekkmaknocegonkakahkhbc
   ============================================= */

const SHOWS = [
  {
    id: 'kim-possible',
    title: "Kim Possible",
    color: '#22c55e',
    description: "What's the sitch? Join Kim on action-packed missions!",
    games: [
      { id: 'bueno-rufus', title: 'Bueno Rufus', desc: 'Help Rufus!', folder: 'games/kim-possible/bueno-rufus', file: 'bueno-rufus.swf' },
      { id: 'stitch-in-time-1', title: 'A Stitch in Time 1', desc: 'Time travel adventure!', folder: 'games/kim-possible/stitch-in-time-1', file: 'stitch-in-time-1.swf' },
      { id: 'stitch-in-time-2', title: 'A Stitch in Time 2', desc: 'Continue the adventure!', folder: 'games/kim-possible/stitch-in-time-2', file: 'stitch-in-time-2.swf' },
      { id: 'stitch-in-time-3', title: 'A Stitch in Time 3', desc: 'The final chapter!', folder: 'games/kim-possible/stitch-in-time-3', file: 'stitch-in-time-3.swf' },
    ]
  },
  {
    id: 'lilo-stitch',
    title: "Lilo & Stitch",
    color: '#06b6d4',
    description: "Ohana means family! Catch experiments in Hawaii.",
    games: [
      { id: 'sandwich-stacker', title: 'Sandwich Stacker', desc: 'Stack sandwiches!', folder: 'games/lilo-stitch/sandwich-stacker' },
    ]
  },
  {
    id: 'suite-life',
    title: "Suite Life of Zack & Cody",
    color: '#ef4444',
    description: "Live the sweet life at the Tipton Hotel!",
    games: []
  },
  {
    id: 'courage',
    title: "Courage the Cowardly Dog",
    color: '#9333ea',
    description: "The things I do for love! Spooky adventures in Nowhere.",
    games: []
  },
  {
    id: 'kids-next-door',
    title: "Codename: Kids Next Door",
    color: '#f97316',
    description: "Kids Next Door, Battle Stations!",
    games: [
      { id: 'operation-tommy', title: 'Operation T.O.M.M.Y.', desc: 'Secret mission!', folder: 'games/kids-next-door/operation-tommy', file: 'operation-tommy.swf' },
    ]
  },
  {
    id: 'fosters',
    title: "Foster's Home for Imaginary Friends",
    color: '#3b82f6',
    description: "Where imaginary friends live when kids outgrow them.",
    games: []
  },
  {
    id: 'misc',
    title: "Misc.",
    color: '#64748b',
    description: "Other classic Flash games.",
    games: [
      { id: 'food-bash', title: 'Food Bash', desc: 'Throw Food!', folder: 'games/misc/food-bash' },
      { id: 'stick-rpg', title: 'Stick RPG', desc: 'Live the stick life!', folder: 'games/misc/stick-rpg', file: 'stick-rpg.swf' },
    ]
  },
  {
    id: 'billy-and-mandy',
    title: "Billy & Mandy",
    color: '#84cc16',
    description: "Grim adventures with Billy and Mandy!",
    games: [
      { id: 'harum-scarum', title: 'Harum Scarum', desc: 'Spooky fun!', folder: 'games/billy-and-mandy/harum-scarum', file: 'harum-scarum.swf' },
    ]
  },
];

// Get all games with their show info (for popular games section)
function getAllGames() {
  const games = [];
  SHOWS.forEach(show => {
    show.games.forEach(game => {
      games.push({
        ...game,
        showId: show.id,
        showTitle: show.title,
        showColor: show.color
      });
    });
  });
  return games;
}

// Generate placeholder image for a show (fallback if no title.jpg)
function getShowPlaceholder(show) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${show.color}"/>
          <stop offset="100%" style="stop-color:#1e293b"/>
        </linearGradient>
      </defs>
      <rect fill="url(#g)" width="200" height="150"/>
      <text x="100" y="80" text-anchor="middle" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">${show.title}</text>
    </svg>
  `;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// Get show image - returns path (fallback handled by onerror in HTML)
function getShowImage(show) {
  return `games/${show.id}/title.jpg`;
}

// Get show image with jpeg fallback
function getShowImageWithFallback(show, img) {
  img.onerror = function() {
    if (this.src.endsWith('.jpg')) {
      this.src = `games/${show.id}/title.jpeg`;
    } else {
      this.src = getShowPlaceholder(show);
    }
  };
  return `games/${show.id}/title.jpg`;
}

// Generate placeholder image for a game (used as fallback if no thumb.jpg)
function getGamePlaceholder(game, color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
      <defs>
        <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color || '#3b82f6'}"/>
          <stop offset="100%" style="stop-color:#0f172a"/>
        </linearGradient>
      </defs>
      <rect fill="url(#gg)" width="320" height="200"/>
      <text x="160" y="90" text-anchor="middle" fill="white" font-family="sans-serif" font-size="16" font-weight="bold">${game.title}</text>
      <text x="160" y="115" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif" font-size="11">${game.desc}</text>
      <circle cx="160" cy="155" r="18" fill="rgba(255,255,255,0.2)"/>
      <polygon points="155,147 155,163 170,155" fill="white"/>
    </svg>
  `;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// Get game thumbnail - tries thumb.jpg first, falls back handled by onerror
function getGameImage(game, color) {
  if (game.folder) {
    return `${game.folder}/thumb.jpg`;
  }
  return getGamePlaceholder(game, color);
}

// Get game thumbnail with jpeg fallback
function getGameImageFallback(game, color) {
  if (game.folder) {
    return `${game.folder}/thumb.jpeg`;
  }
  return getGamePlaceholder(game, color);
}

// Get game thumbnail with webp fallback
function getGameImageWebp(game, color) {
  if (game.folder) {
    return `${game.folder}/thumb.webp`;
  }
  return getGamePlaceholder(game, color);
}

// Get game thumbnail with png fallback
function getGameImagePng(game, color) {
  if (game.folder) {
    return `${game.folder}/thumb.png`;
  }
  return getGamePlaceholder(game, color);
}
