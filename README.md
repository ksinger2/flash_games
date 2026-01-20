# Flash Games Portal

A retro-style Flash games website with a pixelated hearts background animation.

## 📁 Project Structure

```
flashgames-site/
├── index.html    # Main HTML
├── styles.css    # All styling
├── app.js        # Main application logic
├── data.js       # Show and game data (edit to add content)
├── hearts.js     # Pixelated hearts background animation
└── README.md     # This file
```

## 🚀 Running the Site

### Option 1: Live Server (Recommended for Cursor)
1. Install the "Live Server" extension in VS Code/Cursor
2. Right-click `index.html` → "Open with Live Server"

### Option 2: Direct File
Just open `index.html` in your browser.

### Option 3: Python Server
```bash
python -m http.server 8000
# Then open http://localhost:8000
```

## 🎮 Adding Flash Games

### Method 1: Upload via UI
1. On the home page, drag & drop .SWF files into the upload zone
2. Or click "Choose Files" to browse
3. Uploaded games appear in the list - click Play!

### Method 2: Add to Data File
Edit `data.js` to add shows and games:

```javascript
{
  id: 'my-show',
  title: "My Show",
  color: '#ff6600',
  description: "Description here",
  games: [
    { id: 'game-1', title: 'Game Name', desc: 'Description' },
  ]
}
```

## 🔌 Ruffle Flash Emulator

To play .SWF files in modern browsers, add Ruffle:

1. Download from https://ruffle.rs/downloads (Self-Hosted version)
2. Extract to a `ruffle/` folder in your project
3. Add to `index.html` before `</head>`:
   ```html
   <script src="ruffle/ruffle.js"></script>
   ```

Ruffle automatically intercepts embed/object tags and plays SWF files!

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --bg-dark: #0a0e1a;
  --accent-blue: #3b82f6;
  --accent-cyan: #06b6d4;
  /* etc */
}
```

### Hearts Background
Edit `hearts.js` to change:
- `NUM_HEARTS` - number of hearts
- `COLORS` - color palette
- `PIXEL_SIZE` - pixelation level
- Heart size, speed, and alpha values

### Show Thumbnails
Replace placeholder images by editing `getShowImage()` in `data.js` to return real image URLs.

## 📝 Features

- ✅ Pixelated animated hearts background
- ✅ Horizontal show scroller with focus effect
- ✅ Show pages with game grids
- ✅ Home page with popular games
- ✅ Drag & drop SWF upload
- ✅ Game player modal
- ✅ Keyboard support (Escape to close)
- ✅ Dark blue theme throughout

## 🐛 Troubleshooting

**Games not playing?**
- Make sure you have Ruffle installed
- Check browser console for errors

**Hearts not showing?**
- Check that `hearts.js` is loading
- Try refreshing the page

**Upload not working?**
- Only .SWF files are accepted
- Check browser console for errors
