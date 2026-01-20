/* =============================================
   PIXELATED HEARTS BACKGROUND
   Animated canvas shader effect
   ============================================= */

(function() {
  const canvas = document.getElementById('hearts-bg');
  const ctx = canvas.getContext('2d');
  
  // Resize canvas to full window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  // Pixel size for the pixelated effect
  const PIXEL_SIZE = 4;
  
  // Heart shape as a pixel grid (1 = filled, 0 = empty)
  const HEART_PATTERN = [
    [0,0,1,1,0,0,0,1,1,0,0],
    [0,1,1,1,1,0,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0],
  ];
  
  const HEART_WIDTH = HEART_PATTERN[0].length;
  const HEART_HEIGHT = HEART_PATTERN.length;
  
  // Color palette (blue to white gradient)
  const COLORS = [
    { r: 15, g: 23, b: 42 },    // Very dark blue
    { r: 30, g: 58, b: 95 },    // Dark blue
    { r: 59, g: 130, b: 246 },  // Blue
    { r: 96, g: 165, b: 250 },  // Light blue
    { r: 147, g: 197, b: 253 }, // Lighter blue
    { r: 191, g: 219, b: 254 }, // Very light blue
    { r: 224, g: 242, b: 254 }, // Almost white blue
    { r: 255, g: 255, b: 255 }, // White
  ];
  
  // Heart objects
  const hearts = [];
  const NUM_HEARTS = 25;
  
  // Create hearts
  function createHeart() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.5 + Math.random() * 1.5, // Scale factor
      speed: 0.2 + Math.random() * 0.5,
      colorIndex: Math.floor(Math.random() * (COLORS.length - 2)), // Start darker
      colorDirection: 1,
      colorSpeed: 0.005 + Math.random() * 0.01,
      colorProgress: Math.random(),
      alpha: 0.1 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.3,
    };
  }
  
  // Initialize hearts
  for (let i = 0; i < NUM_HEARTS; i++) {
    hearts.push(createHeart());
  }
  
  // Lerp between colors
  function lerpColor(c1, c2, t) {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t),
    };
  }
  
  // Draw a pixelated heart
  function drawHeart(heart) {
    const pixelSize = PIXEL_SIZE * heart.size;
    const startX = heart.x - (HEART_WIDTH * pixelSize) / 2;
    const startY = heart.y - (HEART_HEIGHT * pixelSize) / 2;
    
    // Calculate current color
    const colorIdx = Math.floor(heart.colorIndex);
    const nextColorIdx = Math.min(colorIdx + 1, COLORS.length - 1);
    const colorT = heart.colorIndex - colorIdx;
    const color = lerpColor(COLORS[colorIdx], COLORS[nextColorIdx], colorT);
    
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${heart.alpha})`;
    
    // Draw each pixel of the heart
    for (let row = 0; row < HEART_HEIGHT; row++) {
      for (let col = 0; col < HEART_WIDTH; col++) {
        if (HEART_PATTERN[row][col]) {
          const px = startX + col * pixelSize;
          const py = startY + row * pixelSize;
          ctx.fillRect(
            Math.floor(px), 
            Math.floor(py), 
            Math.ceil(pixelSize), 
            Math.ceil(pixelSize)
          );
        }
      }
    }
  }
  
  // Update heart position and color
  function updateHeart(heart) {
    // Move upward
    heart.y -= heart.speed;
    heart.x += heart.drift;
    
    // Color pulsing
    heart.colorProgress += heart.colorSpeed;
    heart.colorIndex = 1 + Math.sin(heart.colorProgress) * 2 + 2;
    
    // Reset when off screen
    if (heart.y < -50) {
      heart.y = canvas.height + 50;
      heart.x = Math.random() * canvas.width;
    }
    
    // Wrap horizontally
    if (heart.x < -50) heart.x = canvas.width + 50;
    if (heart.x > canvas.width + 50) heart.x = -50;
  }
  
  // Animation loop
  function animate() {
    // Clear with dark background
    ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw hearts
    hearts.forEach(heart => {
      updateHeart(heart);
      drawHeart(heart);
    });
    
    requestAnimationFrame(animate);
  }
  
  // Initial clear
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Start animation
  animate();
})();
